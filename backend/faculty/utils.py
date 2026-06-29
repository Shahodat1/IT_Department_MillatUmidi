from .models import AuditLog


def log_action(
    *,
    user=None,
    action,
    model_name=None,
    object_id=None,
    object_repr=None,
    message=None,
    ip_address=None,
):
    return AuditLog.objects.create(
        user=user if user and user.is_authenticated else None,
        action=action,
        model_name=model_name,
        object_id=object_id,
        object_repr=object_repr,
        message=message,
        ip_address=ip_address,
    )