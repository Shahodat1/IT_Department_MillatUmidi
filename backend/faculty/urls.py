from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    GlobalSearchView,
    TeacherViewSet,
    SemesterViewSet,
    CourseViewSet,
    TeacherCourseViewSet,
    EducationViewSet,
    WorkExperienceViewSet,
    InterestAreaViewSet,
    ResearchViewSet,
    PublicationViewSet,
    GalleryItemViewSet,
    HonorAwardViewSet,
    TimetableViewSet,
    CertificateViewSet,
    StudentViewSet, 
    CertificateRecipientViewSet,
    DepartmentViewSet,
    AnnouncementViewSet,
    EventViewSet,
    StatisticsViewSet,
    PartnerViewSet,
    AuditLogViewSet,
    CourseJobViewSet,
    OfficeHourViewSet,
)

router = DefaultRouter()

router.register("teachers", TeacherViewSet, basename="teachers")
router.register("semesters", SemesterViewSet, basename="semesters")
router.register("courses", CourseViewSet, basename="courses")

router.register("teacher-courses", TeacherCourseViewSet, basename="teacher-courses")
router.register("education", EducationViewSet, basename="education")
router.register("work-experience", WorkExperienceViewSet, basename="work-experience")
router.register("interest-areas", InterestAreaViewSet, basename="interest-areas")
router.register("research", ResearchViewSet, basename="research")
router.register("publications", PublicationViewSet, basename="publications")
router.register("gallery-items", GalleryItemViewSet, basename="gallery-items")
router.register("honor-awards", HonorAwardViewSet, basename="honor-awards")
router.register("timetable", TimetableViewSet, basename="timetable")
router.register('certificates', CertificateViewSet) 
router.register('students', StudentViewSet) 
router.register('certificate-recipients', CertificateRecipientViewSet)
router.register("departments", DepartmentViewSet, basename="departments")
router.register("announcements", AnnouncementViewSet, basename="announcements")

router.register("events", EventViewSet, basename="events")

router.register("course-jobs", CourseJobViewSet, basename="course-jobs")

router.register("statistics", StatisticsViewSet, basename="statistics")
router.register("partners", PartnerViewSet, basename="partners")

router.register("audit-logs", AuditLogViewSet, basename="audit-logs")
router.register(
    "office-hours",
    OfficeHourViewSet,
    basename="office-hours"
)



urlpatterns = [
    
    path("", include(router.urls)),
    path("search/", GlobalSearchView.as_view(), name="global-search"),
    
]