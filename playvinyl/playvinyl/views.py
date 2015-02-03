from rest_auth.views import PasswordReset, PasswordResetConfirm
from playvinyl.serializers import (
    FixedPasswordResetSerializer,
    FixedPasswordResetConfirmSerializer
)
from rest_framework.permissions import AllowAny


class FixedPasswordReset(PasswordReset):
    serializer_class = FixedPasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        print(request.LANGUAGE_CODE)
        return super(FixedPasswordReset, self).post(request)

class FixedPasswordResetConfirm(PasswordResetConfirm):
    serializer_class = FixedPasswordResetConfirmSerializer
    permission_classes = (AllowAny,)
