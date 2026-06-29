from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """
    Faqat admin.
    """

    message = "Admin access required."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) == "admin"
        )


class IsTeacher(BasePermission):
    """
    Faqat teacher.
    """

    message = "Teacher access required."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) == "teacher"
        )


class IsAdminOrTeacher(BasePermission):
    """
    Admin yoki teacher.
    """

    message = "Admin or teacher access required."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) in ("admin", "teacher")
        )


class ReadOnly(BasePermission):
    """
    GET, HEAD, OPTIONS — hamma uchun ochiq
    POST, PUT, PATCH, DELETE — faqat admin
    """

    message = "Write access required."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user = getattr(request, "user", None)
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) == "admin"
        )