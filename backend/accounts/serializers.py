from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from rest_framework import serializers
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        trim_whitespace=False,
    )
    teacher_id = serializers.SerializerMethodField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    must_change_password = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "role",
            "is_staff",
            "is_superuser",
            "must_change_password",
            "teacher_id",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        is_admin_request = bool(
            request and request.user.is_authenticated and request.user.is_staff
        )

        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError({"password": "Password majburiy."})

        if self.instance is None and not is_admin_request:
            attrs["role"] = "user"

        if self.instance is not None and not is_admin_request:
            if "role" in attrs and attrs["role"] != self.instance.role:
                raise serializers.ValidationError(
                    {"role": "Role o‘zgartirishga ruxsat yo‘q."}
                )

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        is_admin_request = bool(
            request and request.user.is_authenticated and request.user.is_staff
        )

        password = validated_data.pop("password")
        role = validated_data.pop("role", "user")

        if not is_admin_request:
            role = "user"

        user = User(**validated_data)
        user.role = role
        user.set_password(password)

        if role == "admin":
            user.is_staff = True
            user.is_superuser = True
            user.must_change_password = False
        elif role == "teacher":
            user.is_staff = False
            user.is_superuser = False
            user.must_change_password = True
        else:
            user.is_staff = False
            user.is_superuser = False
            user.must_change_password = False

        user.save()
        return user

    def update(self, instance, validated_data):
        request = self.context.get("request")
        is_admin_request = bool(
            request and request.user.is_authenticated and request.user.is_staff
        )

        password = validated_data.pop("password", None)
        role = validated_data.pop("role", getattr(instance, "role", "user"))

        if not is_admin_request:
            role = instance.role

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.role = role

        if password:
            instance.set_password(password)
            if role == "teacher":
                instance.must_change_password = True

        if role == "admin":
            instance.is_staff = True
            instance.is_superuser = True
            instance.must_change_password = False
        elif role == "teacher":
            instance.is_staff = False
            instance.is_superuser = False
        else:
            instance.is_staff = False
            instance.is_superuser = False
            instance.must_change_password = False

        instance.save()

        teacher = getattr(instance, "teacher", None)
        if teacher:
            teacher.first_name = instance.first_name
            teacher.last_name = instance.last_name
            if instance.email:
                teacher.email = instance.email
            teacher.save()

        return instance

    def get_teacher_id(self, obj):
        teacher = getattr(obj, "teacher", None)
        return teacher.id if teacher else None


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["must_change_password"] = user.must_change_password
        token["is_staff"] = user.is_staff
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user, context=self.context).data
        data["role"] = self.user.role
        data["is_staff"] = self.user.is_staff
        data["must_change_password"] = self.user.must_change_password
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        old_password = attrs.get("old_password")
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if not user.must_change_password:
            if not old_password:
                raise serializers.ValidationError(
                    {"old_password": "Eski parol kiritilishi shart."}
                )
            if not user.check_password(old_password):
                raise serializers.ValidationError(
                    {"old_password": "Eski parol noto‘g‘ri."}
                )

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {"confirm_password": "Yangi parollar mos emas."}
            )

        validate_password(new_password, user=user)
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.must_change_password = False
        user.save(update_fields=["password", "must_change_password"])
        return user

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate_refresh(self, value):
        if not value.strip():
            raise serializers.ValidationError("Refresh token majburiy.")
        return value

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.validated_data["refresh"])
            token.blacklist()
        except TokenError:
            raise serializers.ValidationError(
                "Refresh token noto‘g‘ri yoki eskirgan."
            )


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = value.strip().lower()
        if not User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Bu email bilan user topilmadi.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Yangi parollar mos emas."}
            )

        try:
            validate_password(attrs["new_password"])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return attrs

    def validate_token_and_user(self):
        uidb64 = self.validated_data["uidb64"]
        token = self.validated_data["token"]

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            raise serializers.ValidationError("Link noto‘g‘ri.")

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("Reset token noto‘g‘ri yoki eskirgan.")

        return user

    def save(self, **kwargs):
        user = self.validate_token_and_user()
        user.set_password(self.validated_data["new_password"])
        if hasattr(user, "must_change_password"):
            user.must_change_password = False
        user.save()
        return user