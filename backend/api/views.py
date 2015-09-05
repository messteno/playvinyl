from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class ProfileView(GenericAPIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        is_authenticated = request.user.is_authenticated()

        return Response({
            'is_authenticated': is_authenticated,
        })
