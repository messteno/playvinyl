from rest_auth.serializers import (
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
)
from rest_framework import serializers
from django.utils.http import urlsafe_base64_decode as uid_decoder
from django.contrib.auth.tokens import default_token_generator
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext, ugettext_lazy as _


class FixedPasswordResetSerializer(PasswordResetSerializer):
    email_error_messages = {
        'no_such_user': _('There is no user with such email'),
        'invalid_email': _('Error'),
    }

    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(
            data=self.initial_data
        )
        UserModel = get_user_model()
        active_users = UserModel._default_manager.filter(
            email__iexact=value, is_active=True)
        if not active_users:
            raise serializers.ValidationError(
                self.email_error_messages['no_such_user'],
            )
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(
                self.email_error_messages['invalid_email'],
            )
        super(FixedPasswordResetSerializer, self).validate_email(value)
        return value


class FixedPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    validate_error_messages = {
        'invalid_uid': _('Invalid uid'),
        'invalid_token': _('Invalid token'),
    }

    def validate(self, attrs):
        self._errors = {}
        # Get the UserModel
        UserModel = get_user_model()
        # Decode the uidb64 to uid to get User object
        try:
            uid = uid_decoder(attrs['uid'])
            self.user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            raise ValidationError({
                'non_field_errors': [
                    self.validate_error_messages['invalid_uid']
                ]
            })

        self.custom_validation(attrs)
        self.set_password_form = self.set_password_form_class(user=self.user,
            data=attrs)
        if not self.set_password_form.is_valid():
            raise ValidationError(self.set_password_form.errors)

        if not default_token_generator.check_token(self.user, attrs['token']):
            raise ValidationError({
                'non_field_errors': [
                    self.validate_error_messages['invalid_token']
                ]
            })
        
        super(FixedPasswordResetConfirmSerializer, self).validate(attrs)
        return attrs
