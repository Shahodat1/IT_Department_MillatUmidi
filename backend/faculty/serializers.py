import json
from django.db import transaction
from rest_framework import serializers


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
    CourseResource,
    CourseItem,
    OfficeHour,
    CourseWeek,
    CourseGrading,
)

from .models import AuditLog

def create_audit_log(request, action, obj, message):
    if not request or not request.user.is_authenticated:
        return

    AuditLog.objects.create(
        user=request.user,
        action=action,
        model_name=obj.__class__.__name__,
        object_id=obj.pk,
        object_repr=str(obj),
        message=message,
        ip_address=request.META.get("REMOTE_ADDR"),
    )


class NestedRelatedListField(serializers.Field):
    """
    Accepts:
    - Python list (normal JSON request)
    - JSON string (FormData payload)
    Returns serialized nested list on output.
    """

    def __init__(self, serializer_class, **kwargs):
        self.serializer_class = serializer_class
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        if data in (None, "", []):
            return []

        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON list.")

        if not isinstance(data, list):
            raise serializers.ValidationError("Expected a list.")

        return data

    def to_representation(self, value):
        if value is None:
            return []

        serializer = self.serializer_class(value, many=True, context=self.context)
        return serializer.data


class TeacherMiniSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ("id", "first_name", "last_name", "position", "photo_url")

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.photo and hasattr(obj.photo, "url"):
            return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url
        return None


class InterestAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestArea
        fields = ["id", "title", "description", "image"]



class CourseJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseJob
        fields = ["id", "title", "url"]




class CourseWeekSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = CourseWeek
        fields = [
            "id",
            "week_number",
            "topic",
            "description",
            "file",
            "file_url",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")

        if obj.file and request:
            return request.build_absolute_uri(
                obj.file.url
            )

        return None

    def validate(self, attrs):
        request = self.context["request"]

        if request.user.is_staff:
            return attrs

        teacher = getattr(
            request.user,
            "teacher",
            None
        )

        if not teacher:
            raise serializers.ValidationError(
                "Teacher account required."
            )

        course = attrs.get(
            "course",
            getattr(self.instance, "course", None)
        )

        is_teacher_course = TeacherCourse.objects.filter(
            teacher=teacher,
            course=course
        ).exists()

        if not is_teacher_course:
            raise serializers.ValidationError(
                "You can only manage your own courses."
            )

        return attrs       


class TeacherCourseNestedSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = TeacherCourse
        
        fields = [
            "id",
            "course",
            "year",
            "role",
        ]       


class TeacherCourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    course_name = serializers.CharField(source="course.name", read_only=True)
    course_code = serializers.CharField(source="course.code", read_only=True)
    id = serializers.IntegerField(required=False)
    

    class Meta:
        model = TeacherCourse
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "course",
            "course_name",
            "course_code",
            "year",
            "role",
            "assigned_at",
        ]

    def get_teacher_name(self, obj):
        return str(obj.teacher) if obj.teacher else ""


class EducationSerializer(serializers.ModelSerializer):
    degree_display = serializers.CharField(source="get_degree_display", read_only=True)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Education
        fields = [
            "id",
            "teacher",
            "degree",
            "degree_display",
            "field_of_study",
            "institution",
            "start_year",
            "end_year",
        ]
        read_only_fields = ["teacher"]


class WorkExperienceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = WorkExperience
        fields = [
            "id",
            "teacher",
            "position",
            "organization",
            "start_year",
            "end_year",
            "description",
        ]
        read_only_fields = ["teacher"]


class ResearchSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    image_display = serializers.SerializerMethodField()
    period = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    image_url = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Research
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "project_title",
            "image",
            "image_url",
            "image_display",
            "description",
            "start_year",
            "end_year",
            "period",
            "status",
        ]
        read_only_fields = ["teacher", "image_display", "period", "status"]

    def get_teacher_name(self, obj):
        return str(obj.teacher) if obj.teacher else "-"

    def get_image_display(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def get_period(self, obj):
        if obj.end_year:
            return f"{obj.start_year} - {obj.end_year}"
        return f"{obj.start_year} - Present"

    def get_status(self, obj):
        return "Completed" if obj.end_year else "Ongoing"

    def create(self, validated_data):
        validated_data.pop("image_url", None)
        return Research.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("image_url", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.full_clean()
        instance.save()
        return instance

class PublicationSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    teacher_id = serializers.IntegerField(
        source="teacher.id",
        read_only=True
    )

    image_display = serializers.SerializerMethodField()
    file_display = serializers.SerializerMethodField()

    image_url = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    file_url = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    class Meta:
        model = Publication
        fields = [
            "id",
            "title",
            "description",
            "image",
            "image_url",
            "image_display",
            "file",
            "file_url",
            "file_display",
            "journal",
            "year",
            "month",
            "teacher",
            "teacher_id",
            "teacher_name",
            "is_hidden",
        ]

        read_only_fields = [
            "teacher_id",
            "teacher_name",
            "image_display",
            "file_display",
        ]

    def get_teacher_name(self, obj):
        if obj.teacher:
            return f"{obj.teacher.first_name} {obj.teacher.last_name}"
        return ""

    def get_image_display(self, obj):
        request = self.context.get("request")

        if obj.image and hasattr(obj.image, "url"):
            return (
                request.build_absolute_uri(obj.image.url)
                if request
                else obj.image.url
            )

        return None

    def get_file_display(self, obj):
        request = self.context.get("request")

        if obj.file and hasattr(obj.file, "url"):
            return (
                request.build_absolute_uri(obj.file.url)
                if request
                else obj.file.url
            )

        return None

    def create(self, validated_data):
        validated_data.pop("image_url", None)
        validated_data.pop("file_url", None)

        return Publication.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("image_url", None)
        validated_data.pop("file_url", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.full_clean()
        instance.save()

        return instance




class GalleryItemSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    teacher_id = serializers.IntegerField(source="teacher.id", read_only=True)
    section_display = serializers.CharField(source="get_section_display", read_only=True)
    month_display = serializers.CharField(source="get_month_display", read_only=True)
    image_display = serializers.SerializerMethodField()
    video_embed_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = [
            "id",
            "section",
            "section_display",
            "title",
            "caption",
            "teacher",
            "teacher_id",
            "teacher_name",
            "year",
            "month",
            "month_display",
            "image",
            "image_display",
            "video_url",
            "video_embed_url",
            "is_active",
            "order",
            "created_at",
        ]

    def get_teacher_name(self, obj):
        return str(obj.teacher) if obj.teacher else ""

    def get_image_display(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def get_video_embed_url(self, obj):
        if not obj.video_url:
            return None

        url = obj.video_url.strip()

        if "youtu.be/" in url:
            video_id = url.split("youtu.be/")[-1].split("?")[0]
            return f"https://www.youtube.com/embed/{video_id}"

        if "watch?v=" in url:
            video_id = url.split("watch?v=")[-1].split("&")[0]
            return f"https://www.youtube.com/embed/{video_id}"

        if "/embed/" in url:
            return url

        return url

class HonorAwardSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    image_url = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    
    id = serializers.IntegerField(required=False)

    class Meta:
        model = HonorAward
        fields = [
            "id",
            "teacher",
            "title",
            "image",
            "image_url",
            "image_display",
            "description",
            "year",
        ]
        read_only_fields = ["teacher", "image_display"]

    def get_image_display(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def create(self, validated_data):
        validated_data.pop("image_url", None)
        return HonorAward.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("image_url", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.full_clean()
        instance.save()
        return instance


class TimetableSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()

    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all()
    )

    course_name = serializers.CharField(
        source="course.name",
        read_only=True
    )

    id = serializers.IntegerField(required=False)

    class Meta:
        model = Timetable
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "course",
            "course_name",
            "day",
            "start_time",
            "end_time",
            "room",
        ]

        read_only_fields = [
            "teacher",
            "teacher_name",
            "course_name",
        ]

    def get_teacher_name(self, obj):
        return str(obj.teacher) if obj.teacher else ""

    def create(self, validated_data):
        teacher = validated_data.pop("teacher", None)

        if teacher is None:
            raise serializers.ValidationError(
                {"teacher": "Teacher is required."}
            )

        return Timetable.objects.create(
            teacher=teacher,
            **validated_data
        )

    def update(self, instance, validated_data):
        validated_data.pop("teacher", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.full_clean()
        instance.save()

        return instance
    

 
class OfficeHourSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = OfficeHour
        fields = [
            "id",
            "day",
            "start_time",
            "end_time",
        ]



class TeacherSerializer(serializers.ModelSerializer):
    academic_degree_display = serializers.CharField(
        source="get_academic_degree_display",
        read_only=True,
    )
    courses = serializers.SerializerMethodField()
    interest_areas = InterestAreaSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()
    user_username = serializers.SerializerMethodField()
    must_change_password = serializers.BooleanField(write_only=True, required=False)

    office_hours = NestedRelatedListField(
        OfficeHourSerializer,
        required=False,
    )

    teacher_courses = NestedRelatedListField(
        TeacherCourseNestedSerializer,
        required=False,
    )

    educations = NestedRelatedListField(EducationSerializer, required=False)
    work_experiences = NestedRelatedListField(WorkExperienceSerializer, required=False)
    researches = NestedRelatedListField(ResearchSerializer, required=False)
    publications = NestedRelatedListField(PublicationSerializer, required=False)
    honor_awards = NestedRelatedListField(HonorAwardSerializer, required=False)
    timetables = NestedRelatedListField(TimetableSerializer, required=False)

    

    class Meta:
        model = Teacher
        fields = [
            "id",
            "user",
            "user_username",
            "first_name",
            "last_name",
            "position",
            "academic_degree",          
            "academic_degree_display",
            "email",
            "phone",
            "bio",
            "photo",
            "photo_url",
            "skills",
            "hobbies",
            "office_hours",
            "teacher_courses",
            "attachment",
            "attachment_url",
            "is_active",
            "temporary_password",
            "must_change_password",
            "courses",
            "interest_areas",
            "educations",
            "work_experiences",
            "researches",
            "publications",
            "honor_awards",
            "timetables",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "user_username",
            "photo_url",
            "temporary_password",
            "courses",
            "interest_areas",
            "academic_degree_display",
            "created_at",
            "updated_at",
        ]

    def get_user_username(self, obj):
        return obj.user.username if obj.user else None

    def _save_nested_items(self,teacher,field_name,serializer_class,items,):
        print("\n========================")
        print("FIELD:", field_name)
        print("========================")

        
        print("ITEMS COUNT:", len(items or []))
        print("ITEMS:", items)
        print("========================")

        
        
        request = self.context.get("request")
        related_manager = getattr(teacher, field_name)
         # databasedagi mavjud objectlar 
        existing_objects = {
            obj.id: obj
            for obj in related_manager.all()
        }

    # frontenddan kelgan id lar
        incoming_ids = set()
        
        for item in items or []:
            print("\n===================")
            print("ITEM =", item)
            print("ITEM ID =", item.get("id"))
            print("ITEM TYPE =", type(item.get("id")))
            print("===================\n")
            
            try:
                obj_id = item.get("id")
                
                if obj_id and obj_id in existing_objects:
                    obj = existing_objects[obj_id]
                    
                    serializer = serializer_class(
                        obj,
                        data=item,
                        partial=True,
                        context=self.context,
                    )

                    serializer.is_valid(raise_exception=True)

                    updated_obj = serializer.save()
                    
                    create_audit_log(
                        request=request,
                        action="update",
                        obj=updated_obj,
                        message=f"{updated_obj.__class__.__name__} updated",
                    )

                    incoming_ids.add(obj_id)

                    print("UPDATED:", updated_obj)

            # CREATE
                else:
                    serializer = serializer_class(
                        data=item,
                        context=self.context,
                    )

                    serializer.is_valid(raise_exception=True)

                    new_obj = serializer.save(
                        teacher=teacher
                    )

                    create_audit_log(
                        request=request,
                        action="create",
                        obj=new_obj,
                        message=f"{new_obj.__class__.__name__} created",
                    )

                    incoming_ids.add(new_obj.id)

                    print("CREATED:", new_obj)

            except Exception as e:
                print("FAILED IN:", field_name)
                print("ITEM:", item)
                print("ERROR:", e)
                raise

    # DELETE
        # DELETE
        for obj_id, obj in existing_objects.items():
            print("CHECK DELETE:", obj_id, obj)
            
            if obj_id not in incoming_ids:
                if obj.pk is None:
                    print("SKIPPED NONE PK:", obj)
                    
                    continue

                create_audit_log(
                    request=request,
                    action="delete",
                    obj=obj,
                    message=f"{obj.__class__.__name__} deleted",
                )

                obj.delete()

                print("DELETED:", obj_id)

    @transaction.atomic
    def create(self, validated_data):

        office_hours_data = validated_data.pop("office_hours", [])
        teacher_courses_data = validated_data.pop("teacher_courses", [])


        educations_data = validated_data.pop("educations", [])
        work_experiences_data = validated_data.pop("work_experiences", [])
        researches_data = validated_data.pop("researches", [])
        publications_data = validated_data.pop("publications", [])
        honor_awards_data = validated_data.pop("honor_awards", [])
        timetables_data = validated_data.pop("timetables", [])
        must_change_password = validated_data.pop("must_change_password", None)

        teacher = super().create(validated_data)

        if must_change_password is not None and teacher.user:
            teacher.user.must_change_password = must_change_password
            teacher.user.save(update_fields=["must_change_password"])

        self._save_nested_items(teacher, "educations", EducationSerializer, educations_data)
        self._save_nested_items(teacher, "work_experiences", WorkExperienceSerializer, work_experiences_data)
        self._save_nested_items(teacher, "researches", ResearchSerializer, researches_data)
        self._save_nested_items(teacher, "publications", PublicationSerializer, publications_data)
        self._save_nested_items(teacher, "honor_awards", HonorAwardSerializer, honor_awards_data)
        self._save_nested_items(teacher, "timetables", TimetableSerializer, timetables_data)
        self._save_nested_items(
    teacher,
    "office_hours",
    OfficeHourSerializer,
    office_hours_data
)

        for item in teacher_courses_data:
            TeacherCourse.objects.create(
                teacher=teacher,
                **item
    )

        return teacher

    @transaction.atomic
    def update(self, instance, validated_data):
        print("\n\n========================")
        print("TEACHER UPDATE CALLED")
        print("INSTANCE:", instance.id)
        print("========================\n")



        teacher_courses_data = validated_data.pop(
            "teacher_courses",
            None
        )

        educations_data = validated_data.pop("educations", None)
        work_experiences_data = validated_data.pop("work_experiences", None)
        researches_data = validated_data.pop("researches", None)
        publications_data = validated_data.pop("publications", None)
        honor_awards_data = validated_data.pop("honor_awards", None)
        timetables_data = validated_data.pop("timetables", None)
        must_change_password = validated_data.pop("must_change_password", None)
        office_hours_data = validated_data.pop(
        "office_hours",
        None
    )

        teacher = super().update(instance, validated_data)

        if teacher.user:
            user_update_fields = []

            if teacher.user.first_name != teacher.first_name:
                teacher.user.first_name = teacher.first_name
                user_update_fields.append("first_name")

            if teacher.user.last_name != teacher.last_name:
                teacher.user.last_name = teacher.last_name
                user_update_fields.append("last_name")

            if teacher.user.email != teacher.email:
                teacher.user.email = teacher.email
                user_update_fields.append("email")

            if user_update_fields:
                teacher.user.save(update_fields=user_update_fields)

            if must_change_password is not None:
                teacher.user.must_change_password = must_change_password
                teacher.user.save(update_fields=["must_change_password"])

        if educations_data is not None:
            self._save_nested_items(teacher, "educations", EducationSerializer, educations_data)
        if work_experiences_data is not None:
            self._save_nested_items(teacher, "work_experiences", WorkExperienceSerializer, work_experiences_data)
        if researches_data is not None:
            self._save_nested_items(teacher, "researches", ResearchSerializer, researches_data)
        if publications_data is not None:
            self._save_nested_items(teacher, "publications", PublicationSerializer, publications_data)
        if honor_awards_data is not None:
            self._save_nested_items(teacher, "honor_awards", HonorAwardSerializer, honor_awards_data)
        if timetables_data is not None:
            self._save_nested_items(teacher, "timetables", TimetableSerializer, timetables_data)
        if office_hours_data is not None:
            self._save_nested_items(teacher,"office_hours",OfficeHourSerializer,office_hours_data
)    

        if teacher_courses_data is not None:
            teacher.teacher_courses.all().delete()
            for item in teacher_courses_data:
                course_id = item.pop("course")
                TeacherCourse.objects.create(
                    teacher=teacher,
                    course=Course.objects.get(pk=course_id),
                    year=item.get("year"),
                    role=item.get("role"),
                )
        return teacher

    def get_courses(self, obj):
        qs = obj.teacher_courses.select_related("course").all()
        result = []

        for tc in qs:
            if not tc.course:
                continue

            result.append(
                {
                    "id": tc.course.id,
                    "name": tc.course.name,
                    "code": tc.course.code,
                    "year": tc.year,
                    "role": tc.role,
                }
            )

        return result

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.photo and hasattr(obj.photo, "url"):
            return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url
        return None 




class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = "__all__"

    def validate(self, attrs):
        start_date = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end_date = attrs.get("end_date", getattr(self.instance, "end_date", None))

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date start date dan keyin bo'lishi kerak"
            })

        return attrs






class CourseResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseResource
        fields = ["id", "title", "url"]



class CourseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseItem
        fields = [
            "id",
            "item_type",
            "title",
            "description",
            "url",
        ]  


class CourseGradingSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = CourseGrading
        fields = [
            "id",
            "title",
            "score",
        ]



class CourseSerializer(serializers.ModelSerializer):
    teachers = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    semester_name = serializers.SerializerMethodField()

    weeks = CourseWeekSerializer(
      many=True,
      read_only=True
    )

    grading_criteria = CourseGradingSerializer(
        many=True,
        required=False
    )

    jobs = CourseJobSerializer(
    many=True,
    required=False
)

    resources = CourseResourceSerializer(
        many=True,
        required=False
    )

    items = CourseItemSerializer(
    many=True,
    required=False
    )

    semester = serializers.PrimaryKeyRelatedField(
        queryset=Semester.objects.all()
    )

    class Meta:
        model = Course
        fields = [
    "id",
    "code",
    "name",
    "image",
    "image_url",
    "semester",
    "semester_name",
    "description",
    "credits",
    "weeks",
    "grading_criteria",

    "hero_title",
    "hero_description",
    "about_title",
    "about_description",

    "video_url",

    "teachers",
    "jobs",
    "resources",
    "items",
    ] 

    def create(self, validated_data):
        jobs_data = validated_data.pop("jobs", [])
        resources_data = validated_data.pop("resources", [])
        items_data = validated_data.pop("items", [])
        grading_data = validated_data.pop("grading_criteria",[])
        validated_data.pop("weeks", None)
        request = self.context["request"]
        weeks_data = request.data.get("weeks", "[]")
        if isinstance(weeks_data, str):
            weeks_data = json.loads(weeks_data)

        print("REQUEST.DATA =", request.data)
        print("VALIDATED =", validated_data)    

        course = Course.objects.create(**validated_data)
        for job in jobs_data:
            CourseJob.objects.create(
            course=course,
            **job
        )

        for resource in resources_data:
            CourseResource.objects.create(
                course=course,
                **resource
            )

        for item in items_data:
               CourseItem.objects.create(
               course=course,
                **item
           ) 
               
        for criterion in grading_data:
            CourseGrading.objects.create(
                course=course,
                **criterion
            )    

        for index, week in enumerate(weeks_data):
            file_obj = request.FILES.get(
                f"weeks_{index}_file")
            CourseWeek.objects.create(
                 course=course,
                   week_number=week.get("week_number"),
                   topic=week.get("topic"),
                   description=week.get("description"),
                   file=file_obj,
                   )
        return course

    def update(self, instance, validated_data):
        jobs_data = validated_data.pop("jobs", None)
        resources_data = validated_data.pop("resources", None)
        items_data = validated_data.pop("items", None)
        grading_data = validated_data.pop("grading_criteria",None)
        validated_data.pop("weeks", None)
        request = self.context["request"]
        weeks_data = request.data.get("weeks", "[]")

        print("WEEKS_DATA =", weeks_data)
        print("TYPE =", type(weeks_data))

        print("REQUEST.DATA =", request.data)
        print("VALIDATED =", validated_data)
        if isinstance(weeks_data, str):
            weeks_data = json.loads(weeks_data)
            print("PARSED =", weeks_data)

        if weeks_data is not None:
            existing_ids = []
            for index, week_data in enumerate(weeks_data):
                week_id = week_data.get("id")
                file_obj = request.FILES.get(
                     f"weeks_{index}_file"
                       )
                if week_id:
                    try:
                        week = CourseWeek.objects.get(
                            id=week_id,
                            course=instance
                        )
                        week.week_number = week_data.get(
                            "week_number"
                        )
                        week.topic = week_data.get(
                            "topic"
                        )
                        week.description = week_data.get(
                             "description"
                        )
                        if file_obj:
                            week.file = file_obj
                        week.save()
                        existing_ids.append(
                            week.id
                        )
                    except CourseWeek.DoesNotExist:
                        pass
                else:
                    week = CourseWeek.objects.create(
                            course=instance,
                            week_number=week_data.get(
                                "week_number"
                            ),
                            topic=week_data.get(
                                "topic"
                            ),
                            description=week_data.get(
                                 "description"
                                 ),
                            file=file_obj,
                    )
                    existing_ids.append(
                        week.id
                    )
            instance.weeks.exclude(
                id__in=existing_ids
            ).delete()
        if items_data is not None:
           instance.items.all().delete()
           for item in items_data:
               CourseItem.objects.create(
                   course=instance,
                   **item
                )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if grading_data is not None:
            print("GRADING DATA =", grading_data)
            existing_ids = []
            for criterion in grading_data:
                print("CRITERION =", criterion)
                print("CRITERION ID =", criterion.get("id"))
                criterion_id = criterion.get("id")
                if criterion_id:
                    try:
                        grading = CourseGrading.objects.get(
                            id=criterion_id,
                            course=instance
                        )
                        grading.title = criterion.get("title")
                        grading.score = criterion.get("score")
                        grading.save()
                        existing_ids.append(grading.id)
                        
                    except CourseGrading.DoesNotExist:
                        pass

                else:
                    grading = CourseGrading.objects.create(
                        course=instance,
                        title=criterion.get("title"),
                        score=criterion.get("score")
                    )

                    existing_ids.append(grading.id)

            instance.grading_criteria.exclude(
                id__in=existing_ids
            ).delete()

        if jobs_data is not None:
            instance.jobs.all().delete()
            for job in jobs_data:
                CourseJob.objects.create(
                course=instance,
                **job
            )

        if resources_data is not None:
            instance.resources.all().delete()

            for resource in resources_data:
                CourseResource.objects.create(
                    course=instance,
                    **resource
                )

        return instance

    def get_teachers(self, obj):
        qs = obj.course_teachers.select_related(
            "teacher"
        ).all()

        return [
            {
                "id": tc.teacher.id,
                "name": f"{tc.teacher.first_name} {tc.teacher.last_name}",
                "position": tc.teacher.position,
                "role": tc.role,
                "year": tc.year,
                "photo_url": TeacherMiniSerializer(
                    tc.teacher,
                    context=self.context
                ).data["photo_url"],
            }
            for tc in qs
        ]
    

    def get_semester_name(self, obj):
        return f"Semester {obj.semester.semester_n}"

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.image and hasattr(obj.image, "url"):
            return (
                request.build_absolute_uri(obj.image.url)
                if request
                else obj.image.url
            )
        
        

        return None






class DepartmentSerializer(serializers.ModelSerializer):
    head = TeacherMiniSerializer(read_only=True)

    class Meta:
        model = Department
        fields = "__all__"


class AnnouncementSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "content",
            "type",
            "start_date",
            "end_date",
            "location",
            "telegram_link",
            "image",
            "image_url",
            "file",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
            "department",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None




class EventSerializer(serializers.ModelSerializer):
    speaker_display = serializers.SerializerMethodField()
    department_name = serializers.CharField(source="department.name", read_only=True)
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "speaker",
            "speaker_display",
            "speaker_name",
            "description",
            "start_date",
            "end_date",
            "start_time",
            "location",
            "department",
            "department_name",
            "image",
            "image_url",
            "image_display",
            "video_url",
            "registration_url",
            "is_active",
        ]

    def get_speaker_display(self, obj):
        if obj.speaker:
            return str(obj.speaker)
        return obj.speaker_name

    def get_image_display(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        if obj.image_url:
            return obj.image_url
        return None





class StatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistics
        fields = "__all__"

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name bo'sh bo'lishi mumkin emas.")
        return value

    def validate(self, attrs):
        value = attrs.get("value", getattr(self.instance, "value", None))
        order = attrs.get("order", getattr(self.instance, "order", None))

        if value is not None and value < 0:
            raise serializers.ValidationError({
                "value": "Value manfiy bo'lishi mumkin emas."
            })

        if order is not None and order < 0:
            raise serializers.ValidationError({
                "order": "Order manfiy bo'lishi mumkin emas."
            })

        return attrs





class PartnerSerializer(serializers.ModelSerializer):
    logo_display = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = [
            "id",
            "name",
            "logo",
            "logo_display",
            "website",
            "is_active",
        ]

    def get_logo_display(self, obj):
        request = self.context.get("request")
        if obj.logo and hasattr(obj.logo, "url"):
            return request.build_absolute_uri(obj.logo.url) if request else obj.logo.url
        return None

class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "user",
            "action",
            "model_name",
            "object_id",
            "object_repr",
            "message",
            "created_at",
            "ip_address",
        ]
        read_only_fields = fields

class CourseJobSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="course.name", read_only=True)
    course_code = serializers.CharField(source="course.code", read_only=True)

    class Meta:
        model = CourseJob
        fields = ["id", "course", "course_name", "course_code", "title", "url"]


class CertificateRecipientSerializer(serializers.ModelSerializer):
    recipient_type = serializers.SerializerMethodField()
    recipient_name = serializers.SerializerMethodField()

    class Meta:
        model = CertificateRecipient
        fields = [
            "id",
            "teacher",
            "student",
            "department",
            "recipient_type",
            "recipient_name",
        ]

    def get_recipient_type(self, obj):
        if obj.teacher:
            return "Teacher"
        if obj.student:
            return "Student"
        if obj.department:
            return "Department"
        return "-"

    def get_recipient_name(self, obj):
        if obj.teacher:
            return str(obj.teacher)
        if obj.student:
            return str(obj.student)
        if obj.department:
            return str(obj.department)
        return "-"





class CertificateSerializer(serializers.ModelSerializer):
    recipients = CertificateRecipientSerializer(
        many=True,
        required=False
    )

    image_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    has_image = serializers.SerializerMethodField()
    has_file = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = [
            "id",
            "title",
            "issuer",
            "date_issued",
            "file",
            "image",
            "image_url",
            "file_url",
            "has_image",
            "has_file",
            "recipients",
        ]

    def create(self, validated_data):
        recipients_data = self.initial_data.get("recipients", "[]")

        try:
            recipients_data = json.loads(recipients_data)
        except Exception:
            recipients_data = []

        certificate = Certificate.objects.create(**validated_data)

        for recipient in recipients_data:
            CertificateRecipient.objects.create(
                certificate=certificate,
                teacher_id=recipient.get("teacher") or None,
                student_id=recipient.get("student") or None,
                department_id=recipient.get("department") or None,
            )

        return certificate

    def update(self, instance, validated_data):
        validated_data.pop("recipients", None)

        recipients_data = self.initial_data.get("recipients")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        if recipients_data is not None:
            if isinstance(recipients_data, str):
                recipients_data = json.loads(recipients_data)

            instance.recipients.all().delete()

            for item in recipients_data:
                CertificateRecipient.objects.create(
                    certificate=instance,
                    teacher_id=item.get("teacher") or None,
                    student_id=item.get("student") or None,
                    department_id=item.get("department") or None,
                )

        return instance

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.image and hasattr(obj.image, "url"):
            return (
                request.build_absolute_uri(obj.image.url)
                if request
                else obj.image.url
            )

        return None

    def get_file_url(self, obj):
        request = self.context.get("request")

        if obj.file and hasattr(obj.file, "url"):
            return (
                request.build_absolute_uri(obj.file.url)
                if request
                else obj.file.url
            )

        return None

    def get_has_image(self, obj):
        return bool(obj.image)

    def get_has_file(self, obj):
        return bool(obj.file)

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name", "group", "enrollment_year"]


