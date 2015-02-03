from rest_auth.views import PasswordReset, PasswordResetConfirm
from playvinyl.serializers import (
    FixedPasswordResetSerializer,
    FixedPasswordResetConfirmSerializer
)
from rest_framework.permissions import AllowAny


class FixedPasswordReset(PasswordReset):
    serializer_class = FixedPasswordResetSerializer
    permission_classes = (AllowAny,)


class FixedPasswordResetConfirm(PasswordResetConfirm):
    serializer_class = FixedPasswordResetConfirmSerializer
    permission_classes = (AllowAny,)
