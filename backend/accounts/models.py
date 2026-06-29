from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("teacher", "Teacher"),
        ("user", "User"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    must_change_password = models.BooleanField(default=False)

    def __str__(self):
        return self.username