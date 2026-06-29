from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import RegexValidator
from django.utils.text import slugify
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

User = get_user_model()


def validate_pdf(file):
    if not file.name.endswith(".pdf"):
        raise ValidationError("Faqat PDF fayl yuklash mumkin")


phone_validator = RegexValidator(
    regex=r'^\+?\d{9,15}$',
    message="Telefon raqam noto'g'ri formatda"
)


class Teacher(models.Model):

    ACADEMIC_DEGREE_CHOICES = [
        ("bachelor", "Bachelor"),
        ("master", "Master"),
        ("phd", "PhD"),
        ("dsc", "Doctor of Science"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teacher',
        null=True,
        blank=True
    )

    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    position = models.CharField(max_length=150)
    academic_degree = models.CharField(
        max_length=20,
        choices=ACADEMIC_DEGREE_CHOICES,
        blank=True,
        null=True,
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True, validators=[phone_validator])
    bio = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='teachers/', blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    hobbies = models.TextField(blank=True, null=True)
    attachment = models.FileField(
        upload_to='teacher_files/',
        blank=True,
        null=True,
        validators=[validate_pdf]
    )
    attachment_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    temporary_password = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def create_unique_username(self):
        base_username = self.email.split("@")[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        return username

    def generate_temp_password(self):
        return get_random_string(
            length=10,
            allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$'
        )

    def save(self, *args, **kwargs):
        if self._state.adding and not self.user:
            username = self.create_unique_username()
            temp_password = self.generate_temp_password()

            user = User.objects.create_user(
                username=username,
                email=self.email,
                password=temp_password,
                first_name=self.first_name,
                last_name=self.last_name,
            )

            self.user = user
            self.temporary_password = temp_password

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['last_name']
        verbose_name = "Teacher"
        verbose_name_plural = "Teachers"



class Semester(models.Model):
    semester_n = models.PositiveIntegerField(unique=True)
    start_date = models.DateField()
    end_date = models.DateField()

    def clean(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError({
                "end_date": "End date start date dan keyin bo'lishi kerak"
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Semester {self.semester_n}"

    class Meta:
        ordering = ["semester_n"]
        verbose_name = "Semester"
        verbose_name_plural = "Semesters"



class Course(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)

    image = models.ImageField(upload_to="courses/", blank=True, null=True)

   

    semester = models.ForeignKey(
        "Semester",
        on_delete=models.CASCADE,
        related_name="courses",
    )

    teachers = models.ManyToManyField(
        "Teacher",
        through="TeacherCourse",
    )

    description = models.TextField(blank=True, null=True)

    credits = models.PositiveIntegerField()

    # YANGI FIELDLAR

    hero_title = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    hero_description = models.TextField(
        blank=True,
        null=True
    )

    about_title = models.CharField(
        max_length=255,
        default="About This Program"
    )

    about_description = models.TextField(
        blank=True,
        null=True
    )

   

    video_url = models.URLField(
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["name"]


class CourseWeek(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="weeks"
    )

    week_number = models.PositiveIntegerField()

    topic = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    file = models.FileField(
        upload_to="course_weeks/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["week_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["course", "week_number"],
                name="unique_course_week"
            )
        ]

    def __str__(self):
        return f"{self.course.name} - Week {self.week_number}"



class CourseGrading(models.Model):
    course = models.ForeignKey(
        "Course",
        on_delete=models.CASCADE,
        related_name="grading_criteria"
    )

    title = models.CharField(
        max_length=255
    )

    score = models.PositiveIntegerField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.title} ({self.score})"        
        

class CourseResource(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="resources"
    )
    title = models.CharField(max_length=255)
    url = models.URLField(max_length=2048,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["title"]
        verbose_name = "Course Resource"
        verbose_name_plural = "Course Resources"


class CourseJob(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="jobs"
    )
    title = models.CharField(max_length=200)
    url = models.URLField(blank=True,
        null=True)

    def __str__(self):
        return f"{self.title} - {self.course.name}"

    class Meta:
        ordering = ['title']
        verbose_name = "Course Job"
        verbose_name_plural = "Course Jobs"


class CourseItem(models.Model):
    ITEM_TYPES = (
        ("video", "Video"),
        ("application", "Application"),
        ("skill", "Skill"),
        ("resource", "Resource"),
        ("practice", "Practice"),
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="items"
    )

    item_type = models.CharField(
        max_length=20,
        choices=ITEM_TYPES
    )

    title = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True
    )

    url = models.URLField(max_length=2048,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title        


class TeacherCourse(models.Model):
    ROLE_CHOICES = [
        ('lecturer', 'Lecturer'),
        ('assistant', 'Assistant'),
    ]

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='teacher_courses'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='course_teachers'
    )
    year = models.PositiveIntegerField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.teacher} - {self.course} ({self.year})"

    class Meta:
        unique_together = [
            'teacher',
            'course',
            'year'
        ]
        verbose_name = "Teacher Course"
        verbose_name_plural = "Teacher Courses"


class Education(models.Model):
    DEGREE_CHOICES = [
        ('bachelor', 'Bachelor'),
        ('master', 'Master'),
        ('phd', 'PhD'),
    ]

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='educations'
    )
    degree = models.CharField(max_length=50, choices=DEGREE_CHOICES)
    field_of_study = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)

    def clean(self):
        if self.end_year and self.end_year < self.start_year:
            raise ValidationError("End year start year dan kichik bo'lishi mumkin emas")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_degree_display()} - {self.teacher}"

    class Meta:
        ordering = ['-end_year']
        verbose_name = "Education"
        verbose_name_plural = "Educations"


class WorkExperience(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='work_experiences'
    )
    position = models.CharField(max_length=150)
    organization = models.CharField(max_length=200)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def clean(self):
        if self.end_year and self.end_year < self.start_year:
            raise ValidationError("End year start year dan kichik bo'lishi mumkin emas")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.position} - {self.teacher}"

    class Meta:
        ordering = ['-end_year']
        verbose_name = "Work Experience"
        verbose_name_plural = "Work Experiences"


class InterestArea(models.Model):
    title = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='interests/', blank=True, null=True)
    teachers = models.ManyToManyField(
        Teacher,
        related_name='interest_areas',
        blank=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']
        verbose_name = "Interest Area"
        verbose_name_plural = "Interest Areas"


class Research(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='researches'
    )
    project_title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='research/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)

    def clean(self):
        if self.end_year and self.end_year < self.start_year:
            raise ValidationError("End year start year dan kichik bo'lishi mumkin emas")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.project_title

    class Meta:
        ordering = ['-start_year']
        verbose_name = "Research"
        verbose_name_plural = "Researches"

MONTH_CHOICES = [
    ("january", "January"),
    ("february", "February"),
    ("march", "March"),
    ("april", "April"),
    ("may", "May"),
    ("june", "June"),
    ("july", "July"),
    ("august", "August"),
    ("september", "September"),
    ("october", "October"),
    ("november", "November"),
    ("december", "December"),
]        




class Publication(models.Model):

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='publications'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(
        upload_to='publications/',
        blank=True,
        null=True,
        validators=[validate_pdf]
    )
    image = models.ImageField(upload_to='publications/', blank=True, null=True)
    journal = models.CharField(max_length=200)
    year = models.PositiveIntegerField()
    month = models.CharField(
        max_length=20,blank=True, null=True,
        choices=MONTH_CHOICES
    )
    is_hidden = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-year", "-id"]
        verbose_name = "Publication"
        verbose_name_plural = "Publications"



class GalleryItem(models.Model):
    SECTION_CHOICES = [
        ("video", "Video Gallery"),
        ("photo", "Photo Gallery"),
        ("media", "Media Gallery"),
        
    ]


    section = models.CharField(max_length=20, choices=SECTION_CHOICES)
    title = models.CharField(max_length=255)
    caption = models.TextField(blank=True, null=True)
    teacher = models.ForeignKey(
        "Teacher",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="gallery_items",
    )
    year = models.PositiveIntegerField()
    month = models.CharField(max_length=20, choices=MONTH_CHOICES,blank=True, null=True)
    image = models.ImageField(upload_to="gallery/", blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_section_display()} - {self.title}"

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Gallery Item"
        verbose_name_plural = "Gallery Items"


class HonorAward(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='honor_awards'
    )
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='awards/', blank=True, null=True)
    description = models.TextField(blank=True)
    year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.title} ({self.year})"

    class Meta:
        ordering = ['-year']
        verbose_name = "Honor Award"
        verbose_name_plural = "Honor Awards"


class Timetable(models.Model):
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
    ]

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='timetables'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='timetables'
    )
    day = models.CharField(max_length=20, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50)

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("End time start time dan keyin bo'lishi kerak")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.teacher} - {self.course}"

    class Meta:
        ordering = ['day', 'start_time']
        verbose_name = "Timetable"
        verbose_name_plural = "Timetables"


class OfficeHour(models.Model):
    DAYS = [
        ("monday", "Monday"),
        ("tuesday", "Tuesday"),
        ("wednesday", "Wednesday"),
        ("thursday", "Thursday"),
        ("friday", "Friday"),
        ("saturday", "Saturday"),
    ]

    teacher = models.ForeignKey(
        "Teacher",
        on_delete=models.CASCADE,
        related_name="office_hours",
    )

    day = models.CharField(max_length=20, choices=DAYS)

    start_time = models.TimeField()

    end_time = models.TimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["day", "start_time"]

    def __str__(self):
        return (
            f"{self.teacher.first_name} "
            f"{self.day} "
            f"{self.start_time}-{self.end_time}"
        )        


class Certificate(models.Model):
    title = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    date_issued = models.DateField()
    file = models.FileField(
        upload_to='certificates/',
        blank=True,
        null=True,
        validators=[validate_pdf]
    )
    image = models.ImageField(upload_to='certificates/', blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date_issued']
        verbose_name = "Certificate"
        verbose_name_plural = "Certificates"


class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    group = models.CharField(max_length=50)
    enrollment_year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['last_name']
        verbose_name = "Student"
        verbose_name_plural = "Students"


class CertificateRecipient(models.Model):
    certificate = models.ForeignKey(
        Certificate,
        on_delete=models.CASCADE,
        related_name='recipients'
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='certificate_recipients'
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='certificate_recipients'
    )
    department = models.ForeignKey(
        'Department',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='certificate_recipients'
    )

    def clean(self):
        filled = [self.teacher, self.student, self.department]
        if sum(bool(x) for x in filled) != 1:
            raise ValidationError("Faqat bitta recipient tanlanishi kerak!")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        who = self.teacher or self.student or self.department
        return f"{who} - {self.certificate.title}"

    class Meta:
        ordering = ['certificate']
        verbose_name = "Certificate Recipient"
        verbose_name_plural = "Certificate Recipients"
        constraints = [
            models.UniqueConstraint(
                fields=['certificate', 'teacher', 'student', 'department'],
                name='unique_certificate_recipient'
            ),
            models.CheckConstraint(
                check=(
                    (
                        models.Q(teacher__isnull=False) &
                        models.Q(student__isnull=True) &
                        models.Q(department__isnull=True)
                    ) |
                    (
                        models.Q(teacher__isnull=True) &
                        models.Q(student__isnull=False) &
                        models.Q(department__isnull=True)
                    ) |
                    (
                        models.Q(teacher__isnull=True) &
                        models.Q(student__isnull=True) &
                        models.Q(department__isnull=False)
                    )
                ),
                name='certificate_exactly_one_recipient'
            )
        ]


class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    about_extra = models.TextField(blank=True)
    image = models.ImageField(upload_to='departments/', blank=True, null=True)

    history_pdf = models.FileField(
        upload_to='departments/history/',
        blank=True,
        null=True
    )
    head = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments'
    )
    monday_friday_hours = models.CharField(
        max_length=100,
        default="09:00 AM – 06:00 PM"
    )
    saturday_hours = models.CharField(
        max_length=100,
        default="10:00 AM – 02:00 PM"
    )
    sunday_hours = models.CharField(
        max_length=100,
        default="Closed"
    )
    hours_note = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = "Department"
        verbose_name_plural = "Departments"


class Announcement(models.Model):
    ANNOUNCEMENT_TYPES = [
        ('news', 'News'),
        ('event', 'Event'),
        ('notice', 'Notice'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=300, blank=True)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=ANNOUNCEMENT_TYPES)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='announcements/images/', blank=True, null=True)
    file = models.FileField(upload_to='announcements/files/', blank=True, null=True)
    telegram_link = models.URLField(blank=True, null=True)
    department = models.ForeignKey(
        'Department',
        on_delete=models.CASCADE,
        related_name='announcements',
        null=True,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while Announcement.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def is_upcoming(self):
        return self.start_date and self.start_date >= timezone.now().date()

    def is_past(self):
        return self.start_date and self.start_date < timezone.now().date()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"



class Event(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True, null=True)
    speaker = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='events'
    )
    speaker_name = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=200)
    department = models.ForeignKey(
        'Department',
        on_delete=models.CASCADE,
        related_name='events',
        null=True,
        blank=True
    )
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    registration_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def clean(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValidationError("End date start date dan keyin bo'lishi kerak")

        if not self.speaker and not self.speaker_name:
            raise ValidationError("Speaker yoki Speaker Name kiritilishi kerak")

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while Event.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        self.full_clean()
        super().save(*args, **kwargs)

    def get_image(self):
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return '/static/default.jpg'

    def __str__(self):
        speaker = self.speaker or self.speaker_name
        return f"{self.title} - {speaker}"

    class Meta:
        ordering = ['-start_date']
        verbose_name = "Event"
        verbose_name_plural = "Events"





class Statistics(models.Model):
    name = models.CharField(max_length=255, unique=True)
    value = models.PositiveIntegerField()
    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text="Masalan: fa-users, fa-book"
    )
    order = models.PositiveIntegerField(default=0)

    def clean(self):
        if self.order is not None and self.order < 0:
            raise ValidationError({"order": "Order manfiy bo'lishi mumkin emas."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} – {self.value}"

    class Meta:
        ordering = ["order"]
        verbose_name = "Statistic"
        verbose_name_plural = "Statistics"

class Partner(models.Model):
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to="partners/")
    website = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = "Partner"
        verbose_name_plural = "Partners"





class AuditLog(models.Model):
    ACTION_CHOICES = [
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
        ("login", "Login"),
        ("logout", "Logout"),
        ("password_change", "Password Change"),
        ("password_reset", "Password Reset"),
        ("register", "Register"),
        ("approve", "Approve"),
        ("reject", "Reject"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    object_repr = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"

    def __str__(self):
        return f"{self.action} - {self.object_repr or self.model_name or 'Action'}"