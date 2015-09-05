from rest_auth.views import PasswordResetView, PasswordResetConfirmView
from playvinyl.serializers import (
    FixedPasswordResetSerializer,
    FixedPasswordResetConfirmSerializer
)
from rest_framework.permissions import AllowAny


class FixedPasswordReset(PasswordResetView):
    serializer_class = FixedPasswordResetSerializer
    permission_classes = (AllowAny,)


class FixedPasswordResetConfirm(PasswordResetConfirmView):
    serializer_class = FixedPasswordResetConfirmSerializer
    permission_classes = (AllowAny,)
