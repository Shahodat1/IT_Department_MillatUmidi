from django.contrib import admin

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
)

admin.site.site_header = "IT Department Admin"
admin.site.site_title = "IT Department Admin"
admin.site.index_title = "Dashboard Management"


class TeacherCourseInline(admin.TabularInline):
    model = TeacherCourse
    fk_name = "teacher"
    extra = 0
    autocomplete_fields = ("course",)
    fields = ("course", "year", "role", "assigned_at")
    readonly_fields = ("assigned_at",)


class CourseTeacherInline(admin.TabularInline):
    model = TeacherCourse
    fk_name = "course"
    extra = 0
    autocomplete_fields = ("teacher",)
    fields = ("teacher", "year", "role", "assigned_at")
    readonly_fields = ("assigned_at",)


class EducationInline(admin.TabularInline):
    model = Education
    extra = 0


class WorkExperienceInline(admin.TabularInline):
    model = WorkExperience
    extra = 0


class ResearchInline(admin.TabularInline):
    model = Research
    extra = 0


class PublicationInline(admin.TabularInline):
    model = Publication
    extra = 0


class HonorAwardInline(admin.TabularInline):
    model = HonorAward
    extra = 0


class TimetableInline(admin.TabularInline):
    model = Timetable
    extra = 0


class CourseJobInline(admin.TabularInline):
    model = CourseJob
    extra = 0


class CertificateRecipientInline(admin.TabularInline):
    model = CertificateRecipient
    extra = 1

    autocomplete_fields = (
        "teacher",
        "student",
        "department",
    )


class CourseResourceInline(admin.TabularInline):
    model = CourseResource
    extra = 1

class CourseItemInline(admin.TabularInline):
    model = CourseItem
    extra = 1


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "position", "email", "phone", "is_active", "created_at")
    list_filter = ("is_active", "position")
    search_fields = ("first_name", "last_name", "email", "phone", "position")
    ordering = ("last_name", "first_name")
    inlines = [
        TeacherCourseInline,
        EducationInline,
        WorkExperienceInline,
        ResearchInline,
        PublicationInline,
        HonorAwardInline,
        TimetableInline,
    ]
    readonly_fields = ("created_at", "updated_at")


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ("semester_n", "start_date", "end_date")
    search_fields = ("semester_n",)
    ordering = ("semester_n",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "name",
        "semester",
        "credits",
    )

    search_fields = (
        "code",
        "name",
    )

    list_filter = (
        "semester",
    )

    autocomplete_fields = (
        "semester",
    )

    fieldsets = (
        (
            "Main Information",
            {
                "fields": (
                    "code",
                    "name",
                    "image",
                    "semester",
                    "credits",
                    "description",
                )
            },
        ),
        (
            "Course Detail Page",
            {
                "fields": (
                    "hero_title",
                    "hero_description",
                    "about_title",
                    "about_description",
                    "practice_title",
                    "practice_description",
                    "video_url",
                    "link_url",
                )
            },
        ),
    )

    inlines = [
        CourseResourceInline,
        CourseItemInline,
    ]

@admin.register(CourseJob)
class CourseJobAdmin(admin.ModelAdmin):
    list_display = ("title", "course")
    search_fields = ("title", "course__name")
    autocomplete_fields = ("course",)


@admin.register(TeacherCourse)
class TeacherCourseAdmin(admin.ModelAdmin):
    list_display = ("teacher", "course", "year", "role", "assigned_at")
    list_filter = ("role", "year", "course")
    search_fields = ("teacher__first_name", "teacher__last_name", "course__name")
    autocomplete_fields = ("teacher", "course")
    readonly_fields = ("assigned_at",)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("teacher", "degree", "field_of_study", "institution", "start_year", "end_year")
    list_filter = ("degree", "institution")
    search_fields = ("teacher__first_name", "teacher__last_name", "field_of_study", "institution")
    autocomplete_fields = ("teacher",)


@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ("teacher", "position", "organization", "start_year", "end_year")
    list_filter = ("organization",)
    search_fields = ("teacher__first_name", "teacher__last_name", "position", "organization")
    autocomplete_fields = ("teacher",)


@admin.register(InterestArea)
class InterestAreaAdmin(admin.ModelAdmin):
    list_display = ("title",)
    search_fields = ("title", "description")
    filter_horizontal = ("teachers",)


@admin.register(Research)
class ResearchAdmin(admin.ModelAdmin):
    list_display = ("project_title", "teacher", "start_year", "end_year")
    list_filter = ("start_year", "end_year")
    search_fields = ("project_title", "teacher__first_name", "teacher__last_name")
    autocomplete_fields = ("teacher",)


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ("title", "teacher", "journal", "year", "is_hidden")
    list_filter = ("year", "is_hidden", "teacher")
    search_fields = ("title", "journal", "description", "teacher__first_name", "teacher__last_name")
    autocomplete_fields = ("teacher",)


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ("title", "section", "year", "month", "teacher", "is_active", "order")
    list_filter = ("section", "month", "year", "is_active")
    search_fields = ("title", "caption", "teacher__first_name", "teacher__last_name")
    autocomplete_fields = ("teacher",)
    ordering = ("order", "-created_at")


@admin.register(HonorAward)
class HonorAwardAdmin(admin.ModelAdmin):
    list_display = ("title", "teacher", "year")
    list_filter = ("year",)
    search_fields = ("title", "teacher__first_name", "teacher__last_name")
    autocomplete_fields = ("teacher",)


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ("teacher", "course", "day", "start_time", "end_time", "room")
    list_filter = ("day", "room", "teacher", "course")
    search_fields = ("teacher__first_name", "teacher__last_name", "course__name", "room")
    autocomplete_fields = ("teacher", "course")




@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "issuer",
        "date_issued",
    )

    search_fields = (
        "title",
        "issuer",
    )

    list_filter = (
        "issuer",
        "date_issued",
    )

    inlines = [
        CertificateRecipientInline,
    ]


@admin.register(CertificateRecipient)
class CertificateRecipientAdmin(admin.ModelAdmin):
    list_display = ("certificate", "teacher", "student", "department")
    search_fields = ("certificate__title", "teacher__first_name", "teacher__last_name", "student__first_name", "student__last_name", "department__name")
    autocomplete_fields = ("certificate", "teacher", "student", "department")


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "group", "enrollment_year")
    search_fields = ("first_name", "last_name", "group")
    list_filter = ("group", "enrollment_year")



@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "head", "monday_friday_hours", "saturday_hours", "sunday_hours")
    search_fields = ("name", "description", "head__first_name", "head__last_name")
    autocomplete_fields = ("head",)


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "department", "is_active", "is_featured", "created_at")
    list_filter = ("type", "is_active", "is_featured", "department")
    search_fields = ("title", "short_description", "content")
    autocomplete_fields = ("department",)
    prepopulated_fields = {"slug": ("title",)}
  




@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "start_date", "department", "is_active")
    list_filter = ("is_active", "department", "start_date")
    search_fields = ("title", "description", "location", "speaker_name", "speaker__first_name", "speaker__last_name")
    autocomplete_fields = ("speaker", "department")
    prepopulated_fields = {"slug": ("title",)}
    


@admin.register(Statistics)
class StatisticsAdmin(admin.ModelAdmin):
    list_display = ("name", "value", "order")
    ordering = ("order",)


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ("name", "website", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "website")




@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "action",
        "model_name",
        "object_id",
        "created_at",
        "ip_address",
    )
    list_filter = (
        "action",
        "model_name",
        "created_at",
    )
    search_fields = (
        "user__username",
        "object_repr",
        "message",
        "model_name",
    )
    readonly_fields = (
        "user",
        "action",
        "model_name",
        "object_id",
        "object_repr",
        "message",
        "created_at",
        "ip_address",
    )


 