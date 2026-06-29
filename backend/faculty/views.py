from django.db.models import Q, CharField
from django.db.models.functions import Cast
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.http import FileResponse, Http404
from django.views.decorators.clickjacking import xframe_options_exempt

from rest_framework import serializers, filters
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

from accounts.permissions import IsAdmin

from .models import (
    Teacher,
    Semester,
    Course,
    CourseJob,
    TeacherCourse,
    Education,
    WorkExperience,
    InterestArea,
    Research,
    Publication,
    GalleryItem,
    HonorAward,
    Timetable,
    Certificate, 
    Student, 
    CertificateRecipient,
    Department,
    Announcement,
    Event,
    Statistics,
    Partner,
    AuditLog,
    OfficeHour,
)

from .serializers import (
    TeacherSerializer,
    SemesterSerializer,
    CourseSerializer,
    TeacherCourseSerializer,
    EducationSerializer,
    WorkExperienceSerializer,
    InterestAreaSerializer,
    ResearchSerializer,
    PublicationSerializer,
    GalleryItemSerializer,
    HonorAwardSerializer,
    TimetableSerializer,
    CertificateSerializer,
    StudentSerializer, 
    CertificateRecipientSerializer,
    DepartmentSerializer,
    AnnouncementSerializer,
    EventSerializer,
    StatisticsSerializer,
    PartnerSerializer,
    AuditLogSerializer,
    CourseJobSerializer,
    OfficeHourSerializer,
)

from .utils import log_action


def _get_client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _audit(request, action, obj=None, message=None):
    log_action(
        user=getattr(request, "user", None),
        action=action,
        model_name=obj.__class__.__name__ if obj is not None else None,
        object_id=getattr(obj, "pk", None) if obj is not None else None,
        object_repr=str(obj) if obj is not None else None,
        message=message,
        ip_address=_get_client_ip(request),
    )


class ReadOnlyOrAuthMixin:
    def get_authenticators(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return []
        return super().get_authenticators()

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]


class DepartmentAdminSerializer(serializers.ModelSerializer):
    head = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(),
        allow_null=True,
        required=False,
    )
    head_name = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            "id",
            "name",
            "description",
            "about_extra",
            "image",
            "head",
            "head_name",
            "monday_friday_hours",
            "saturday_hours",
            "sunday_hours",
            "hours_note",
        ]

    def get_head_name(self, obj):
        return str(obj.head) if obj.head else None


class TeacherViewSet(ModelViewSet):
    queryset = Teacher.objects.select_related("user").prefetch_related(
        "teacher_courses__course",
        "interest_areas",
        "educations",
        "work_experiences",
        "researches",
        "publications",
        "honor_awards",
        "timetables",
        "office_hours",
    ).all()

    serializer_class = TeacherSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["first_name", "last_name", "position", "email", "phone"]
    ordering_fields = ["first_name", "last_name", "position", "created_at"]
    filterset_fields = ["is_active", "position"]

    def update(self, request, *args, **kwargs):
        print("\n\n####################")
        print("VIEWSET UPDATE")
        print(request.data)
        print("####################\n")
       

        print("REQUEST =", request.data)
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
            )
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()

        _audit(
            self.request,
            action="update",
            obj=obj,
            message="teacher updated",
        )
        return Response(serializer.data)
       
    
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdmin()]


class SemesterViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    
    serializer_class = SemesterSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["semester_n_text"]
    ordering_fields = ["semester_n", "start_date", "end_date"]
    ordering = ["semester_n"]

    def get_queryset(self):
        return Semester.objects.annotate(
            semester_n_text=Cast("semester_n", CharField())
        )


from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied

class CourseViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    serializer_class = CourseSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    search_fields = [
        "name",
        "code",
        "description",
    ]

    ordering_fields = [
        "name",
        "code",
        "credits",
    ]

    filterset_fields = [
        "semester",
    ]

    def get_queryset(self):
        queryset = (
            Course.objects.select_related(
                "semester",
            )
            .prefetch_related(
                "course_teachers__teacher",
                "jobs",
                "resources",
                "items",
            )
            .all()
        )

        teacher_id = self.request.query_params.get("teacher")

        if teacher_id:
            queryset = queryset.filter(
                course_teachers__teacher_id=teacher_id
            ).distinct()

        return queryset
    
    def perform_create(self, serializer):
        course = serializer.save()

        _audit(
            self.request,
            action="create",
            obj=course,
            message="Course created",
        )

        
        if (
            self.request.user.is_authenticated
            and hasattr(self.request.user, "teacher")
        ):
            TeacherCourse.objects.create(
                teacher=self.request.user.teacher,
                course=course,
                year=timezone.now().year,
                role="lecturer",
            )

    def perform_destroy(self, instance):

        user = self.request.user
        
        if hasattr(user, "teacher"):
            teacher = user.teacher
            
            assigned = TeacherCourse.objects.filter(
                teacher=teacher,
                course=instance
            ).exists()
            
            if not assigned:
                raise PermissionDenied(
                    "You can only delete your own courses."
                )
        

        _audit(
            self.request,
            action="delete",
            obj=instance,
            message="Course deleted",
        )    
        instance.delete()


    def perform_update(self, serializer):
        course = serializer.save()
        
        _audit(
            self.request,
            action="update",
            obj=course,
            message="Course updated",
        )
        
        user = self.request.user
        
        if hasattr(user, "teacher"):
            teacher = user.teacher
            
            assigned = TeacherCourse.objects.filter(
                teacher=teacher,
                course=course
            ).exists()
            
            if not assigned:
                raise PermissionDenied(
                    "You can only edit your own courses."
                )
            
        serializer.save()    

    @action(
        detail=False,
        methods=["get"],
        url_path=r"code/(?P<code>[^/.]+)"
    )
    def get_by_code(self, request, code=None):
        course = get_object_or_404(
            self.get_queryset(),
            code=code
        )

        serializer = self.get_serializer(course)

        return Response(serializer.data)

class CourseJobViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = CourseJob.objects.select_related("course").all()
    serializer_class = CourseJobSerializer

    search_fields = ["title", "course__name"]
    ordering_fields = ["id"]
    filterset_fields = ["course"]


from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)

from rest_framework.viewsets import ModelViewSet

from .models import (
    CourseWeek,
    TeacherCourse
)

from .serializers import (
    CourseWeekSerializer
)


class CourseWeekViewSet(ModelViewSet):

    serializer_class = CourseWeekSerializer

    queryset = CourseWeek.objects.select_related(
        "course"
    )

    filterset_fields = [
        "course",
        "week_number",
    ]

    search_fields = [
        "topic",
        "description",
    ]

    ordering = [
        "week_number"
    ]

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:
            return [AllowAny()]

        return [IsAuthenticated()]

    def get_queryset(self):

        queryset = CourseWeek.objects.select_related(
            "course"
        )

        user = self.request.user

        if user.is_authenticated and user.is_staff:
            return queryset

        teacher = getattr(
            user,
            "teacher",
            None
        )

        if teacher:
            return queryset.filter(
                course__teachers=teacher
            ).distinct()

        return queryset    


class TeacherCourseViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = TeacherCourse.objects.select_related("teacher", "course").all()
    serializer_class = TeacherCourseSerializer

    search_fields = [
        "teacher__first_name",
        "teacher__last_name",
        "course__name",
        "course__code",
    ]
    ordering_fields = ["year", "assigned_at"]
    filterset_fields = ["teacher", "course", "year", "role"]


class EducationViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = Education.objects.select_related("teacher").all()
    serializer_class = EducationSerializer

    search_fields = ["degree", "institution", "field_of_study", "teacher__first_name", "teacher__last_name"]
    ordering_fields = ["start_year", "end_year"]
    filterset_fields = ["teacher", "degree", "institution"]


class WorkExperienceViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = WorkExperience.objects.select_related("teacher").all()
    serializer_class = WorkExperienceSerializer

    search_fields = ["position", "organization", "description", "teacher__first_name", "teacher__last_name"]
    ordering_fields = ["start_year", "end_year"]
    filterset_fields = ["teacher", "organization"]

    def get_queryset(self):
        queryset = super().get_queryset()
        teacher_id = self.request.query_params.get("teacher")
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        return queryset


class InterestAreaViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = InterestArea.objects.prefetch_related("teachers").all()
    serializer_class = InterestAreaSerializer

    search_fields = ["title", "description", "teachers__first_name", "teachers__last_name"]
    ordering_fields = ["title"]


class ResearchViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = Research.objects.select_related("teacher").all()
    serializer_class = ResearchSerializer

    search_fields = ["project_title", "description", "teacher__first_name", "teacher__last_name"]
    ordering_fields = ["start_year", "end_year", "project_title"]
    filterset_fields = ["teacher", "start_year", "end_year"]

    def get_queryset(self):
        queryset = super().get_queryset()
        teacher_id = self.request.query_params.get("teacher")
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        return queryset


class PublicationViewSet(ModelViewSet):
    queryset = Publication.objects.select_related("teacher").all()
    serializer_class = PublicationSerializer

    search_fields = ["title", "journal", "description", "teacher__first_name", "teacher__last_name"]
    ordering_fields = ["year", "id"]
    filterset_fields = ["year", "month","teacher", "is_hidden"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            qs = Publication.objects.select_related("teacher").filter(is_hidden=False)
        elif user.is_staff:
            qs = Publication.objects.select_related("teacher").all()
        elif hasattr(user, "teacher"):
            qs = Publication.objects.select_related("teacher").filter(
                Q(is_hidden=False) | Q(teacher=user.teacher)
            )
        else:
            qs = Publication.objects.select_related("teacher").filter(is_hidden=False)

        return qs.order_by("-id")

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_staff:
            obj = serializer.save()
        else:
            if not hasattr(user, "teacher"):
                raise PermissionDenied("Only teachers can add publications")
            obj = serializer.save(teacher=user.teacher)

        _audit(
            self.request,
            action="create",
            obj=obj,
            message="Publication created",
        )

    def perform_update(self, serializer):
        user = self.request.user
        if "is_hidden" in serializer.validated_data and not user.is_staff:
            raise PermissionDenied("Only admin can hide/unhide")
        if not user.is_staff and hasattr(user, "teacher") and serializer.instance.teacher != user.teacher:
            raise PermissionDenied("You can only edit your own publication")

        obj = serializer.save()

        _audit(
            self.request,
            action="update",
            obj=obj,
            message="Publication updated",
        )

    def perform_destroy(self, instance):
        user = self.request.user
        # admin hamma narsani delete qiladi
        if user.is_staff:
            pass

        # teacher faqat o'z publicationini delete qiladi
        elif hasattr(user, "teacher"):
            if instance.teacher != user.teacher:
                raise PermissionDenied(
                    "You can only delete your own publications"
                )

        else:
            raise PermissionDenied(
                "You don't have permission"
            )

        _audit(
            self.request,
            action="delete",
            obj=instance,
            message="Publication deleted",
        )

        instance.delete()

class GalleryItemViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = GalleryItem.objects.select_related("teacher").all()
    serializer_class = GalleryItemSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    search_fields = ["title", "caption", "teacher__first_name", "teacher__last_name"]
    filterset_fields = ["section", "year", "month", "teacher", "is_active"]
    ordering_fields = ["order", "year", "id"]

    def get_queryset(self):
        user = self.request.user
        qs = GalleryItem.objects.select_related("teacher").order_by("order", "-created_at")

        if user.is_staff:
            return qs

        return qs.filter(is_active=True)

    @action(detail=False, methods=["get"], url_path=r"section/(?P<section>[^/.]+)")
    def by_section(self, request, section=None):
        qs = self.get_queryset().filter(section=section)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class HonorAwardViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = HonorAward.objects.select_related("teacher").all()
    serializer_class = HonorAwardSerializer

    search_fields = ["title", "description", "teacher__first_name", "teacher__last_name"]
    ordering_fields = ["year"]
    filterset_fields = ["teacher", "year"]


class TimetableViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = Timetable.objects.select_related("teacher", "course").all()
    serializer_class = TimetableSerializer

    search_fields = ["teacher__first_name", "teacher__last_name", "course__name", "room"]
    ordering_fields = ["day", "start_time", "end_time"]
    filterset_fields = ["teacher", "course", "day", "room"]



from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

from .models import OfficeHour
from .serializers import OfficeHourSerializer


class OfficeHourViewSet(ModelViewSet):
    serializer_class = OfficeHourSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    queryset = OfficeHour.objects.select_related("teacher").all()

    filterset_fields = ["teacher", "day"]

    search_fields = [
        "teacher__first_name",
        "teacher__last_name",
    ]

    ordering_fields = [
        "day",
        "start_time",
    ]

    def perform_create(self, serializer):
        user = self.request.user

        # Admin yaratishi mumkin
        if user.is_staff or user.is_superuser:
            serializer.save()
            return

        # Teacher faqat o'zi uchun yaratadi
        if hasattr(user, "teacher"):
            serializer.save(teacher=user.teacher)
            return

        raise PermissionDenied(
            "Only teachers can create office hours."
        )

    def perform_update(self, serializer):
        office_hour = self.get_object()
        user = self.request.user

        # Admin hamma narsani edit qiladi
        if user.is_staff or user.is_superuser:
            serializer.save()
            return

        # Teacher faqat o'zinikini edit qiladi
        if (
            hasattr(user, "teacher")
            and office_hour.teacher_id == user.teacher.id
        ):
            serializer.save()
            return

        raise PermissionDenied(
            "You can only edit your own office hours."
        )

    def perform_destroy(self, instance):
        user = self.request.user

        # Admin hamma narsani delete qiladi
        if user.is_staff or user.is_superuser:
            instance.delete()
            return

        # Teacher faqat o'zinikini delete qiladi
        if (
            hasattr(user, "teacher")
            and instance.teacher_id == user.teacher.id
        ):
            instance.delete()
            return

        raise PermissionDenied(
            "You can only delete your own office hours."
        )


class CertificateViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = Certificate.objects.prefetch_related(
        "recipients__teacher",
        "recipients__student",
        "recipients__department",
    ).all()
    serializer_class = CertificateSerializer

    search_fields = ["title", "issuer"]
    ordering_fields = ["date_issued", "title"]
    filterset_fields = ["issuer", "date_issued"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        recipient_type = self.request.query_params.get("recipient_type", "all")

        if recipient_type == "teacher":
            queryset = queryset.filter(recipients__teacher__isnull=False)
        elif recipient_type == "student":
            queryset = queryset.filter(recipients__student__isnull=False)
        elif recipient_type == "department":
            queryset = queryset.filter(recipients__department__isnull=False)

        return queryset.distinct()


class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["first_name", "last_name", "group"]
    ordering_fields = ["last_name", "enrollment_year"]
    filterset_fields = ["group", "enrollment_year"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]


class CertificateRecipientViewSet(ModelViewSet):
    queryset = CertificateRecipient.objects.select_related(
        "certificate", "teacher", "student", "department"
    ).all()
    serializer_class = CertificateRecipientSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = [
        "certificate__title",
        "teacher__first_name",
        "teacher__last_name",
        "student__first_name",
        "student__last_name",
        "department__name",
    ]
    ordering_fields = ["created_at"]
    filterset_fields = ["certificate", "teacher", "student", "department"]

    def create(self, request, *args, **kwargs):
        print("REQUEST DATA =", request.data)
        return super().create(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]
    

class DepartmentViewSet(ModelViewSet):
    queryset = Department.objects.select_related("head").all()

    search_fields = ["name", "description", "head__first_name", "head__last_name"]
    ordering_fields = ["name"]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "history_pdf"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return DepartmentAdminSerializer
        return DepartmentSerializer

    def perform_create(self, serializer):
        obj = serializer.save()
        _audit(
            self.request,
            action="create",
            obj=obj,
            message="Department created",
        )

    def perform_update(self, serializer):
        obj = serializer.save()
        _audit(
            self.request,
            action="update",
            obj=obj,
            message="Department updated",
        )

    def perform_destroy(self, instance):
        _audit(
            self.request,
            action="delete",
            obj=instance,
            message="Department deleted",
        )
        instance.delete()

    @action(detail=False, methods=["get"], url_path="history-pdf")
    @xframe_options_exempt
    def history_pdf(self, request):
        department = Department.objects.first()

        if not department or not department.history_pdf:
            raise Http404("Department history PDF not found")

        pdf_file = department.history_pdf.open("rb")

        response = FileResponse(
            pdf_file,
            content_type="application/pdf",
        )
        response["Content-Disposition"] = (
            f'inline; filename="{department.history_pdf.name.split("/")[-1]}"'
        )
        return response


class AnnouncementViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = Announcement.objects.select_related("department").all()
    serializer_class = AnnouncementSerializer

    search_fields = ["title", "content", "short_description"]
    filterset_fields = ["type", "department", "is_featured", "is_active"]
    ordering_fields = ["created_at", "start_date"]
    ordering = ["-start_date"]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Announcement.objects.select_related("department").all()
        return Announcement.objects.select_related("department").filter(is_active=True)

    def perform_create(self, serializer):
        obj = serializer.save()
        _audit(
            self.request,
            action="create",
            obj=obj,
            message="Announcement created",
        )

    def perform_update(self, serializer):
        obj = serializer.save()
        _audit(
            self.request,
            action="update",
            obj=obj,
            message="Announcement updated",
        )

    def perform_destroy(self, instance):
        _audit(
            self.request,
            action="delete",
            obj=instance,
            message="Announcement deleted",
        )
        instance.delete()

    @action(detail=False, methods=["get"])
    def breaking(self, request):
        queryset = self.get_queryset().filter(type="news").order_by("-created_at")[:6]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def upcoming(self, request):
        queryset = self.get_queryset().filter(start_date__gte=now().date()).order_by("start_date")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def past(self, request):
        queryset = self.get_queryset().filter(start_date__lt=now().date()).order_by("-start_date")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path=r"by-slug/(?P<slug>[^/.]+)")
    def by_slug(self, request, slug=None):
        announcement = get_object_or_404(self.get_queryset(), slug=slug)
        serializer = self.get_serializer(announcement)
        return Response(serializer.data)


class EventViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = Event.objects.select_related("speaker", "department").all()
    serializer_class = EventSerializer

    search_fields = [
        "title",
        "description",
        "location",
        "speaker_name",
        "speaker__first_name",
        "speaker__last_name",
        "department__name",
    ]
    ordering_fields = ["start_date", "id"]
    filterset_fields = {
        "start_date": ["year", "month"],
        "department": ["exact"],
        "is_active": ["exact"],
    }

    def get_queryset(self):
        qs = Event.objects.select_related("speaker", "department").all()
        if not self.request.user.is_staff:
            qs = qs.filter(is_active=True)
        return qs

    def perform_create(self, serializer):
        obj = serializer.save()
        _audit(
            self.request,
            action="create",
            obj=obj,
            message="Event created",
        )

    def perform_update(self, serializer):
        obj = serializer.save()
        _audit(
            self.request,
            action="update",
            obj=obj,
            message="Event updated",
        )

    def perform_destroy(self, instance):
        _audit(
            self.request,
            action="delete",
            obj=instance,
            message="Event deleted",
        )
        instance.delete()

    @action(detail=False, methods=["get"], url_path=r"by-slug/(?P<slug>[^/.]+)")
    def by_slug(self, request, slug=None):
        event = get_object_or_404(self.get_queryset(), slug=slug)
        serializer = self.get_serializer(event)
        return Response(serializer.data)


class StatisticsViewSet(ModelViewSet):
    queryset = Statistics.objects.all()
    serializer_class = StatisticsSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "icon"]
    ordering_fields = ["name", "value", "order", "id"]
    ordering = ["order", "id"]


class PartnerViewSet(ReadOnlyOrAuthMixin, ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    search_fields = ["name", "website"]
    filterset_fields = ["is_active"]
    ordering_fields = ["name", "id"]

    def get_queryset(self):
        qs = Partner.objects.all().order_by("name")
        if not self.request.user.is_staff:
            qs = qs.filter(is_active=True)
        return qs


class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get("search", "").strip()

        if not query:
            return Response({
                "publications": [],
                "teachers": [],
                "courses": [],
                "events": [],
            })

        publications = Publication.objects.select_related("teacher").filter(
            Q(title__icontains=query) | Q(journal__icontains=query)
        )[:5]

        teachers = Teacher.objects.filter(
            Q(first_name__icontains=query) | Q(last_name__icontains=query) | Q(position__icontains=query)
        )[:5]

        courses = Course.objects.select_related("semester").filter(
            Q(name__icontains=query) |
            Q(code__icontains=query) |
            Q(description__icontains=query)
        )[:5]

        events = Event.objects.select_related("speaker", "department").filter(
            Q(title__icontains=query) | Q(description__icontains=query) | Q(location__icontains=query)
        )[:5]

        return Response({
            "publications": PublicationSerializer(publications, many=True, context={"request": request}).data,
            "teachers": TeacherSerializer(teachers, many=True, context={"request": request}).data,
            "courses": CourseSerializer(courses, many=True, context={"request": request}).data,
            "events": EventSerializer(events, many=True, context={"request": request}).data,
        })


class AuditLogViewSet(ModelViewSet):
    queryset = AuditLog.objects.select_related("user").all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "head", "options"]

    search_fields = ["user__username", "action", "model_name", "object_repr", "message"]
    filterset_fields = ["action", "model_name", "user"]
    ordering_fields = ["created_at", "action", "model_name"]