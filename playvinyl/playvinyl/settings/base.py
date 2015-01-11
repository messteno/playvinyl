"""
This is your project's main settings file that can be committed to your
repo. If you need to override a setting locally, use local.py
"""

from sys import path
import os


# Normally you should not import ANYTHING from Django directly
# into your settings, but ImproperlyConfigured is an exception.
from django.core.exceptions import ImproperlyConfigured

def get_env_setting(setting):
    """ Get the environment setting or return exception """
    try:
        return os.environ[setting]
    except KeyError:
        error_msg = "Set the %s env variable" % setting
        raise ImproperlyConfigured(error_msg)


DJANGO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SITE_ROOT = os.path.dirname(DJANGO_ROOT)

SITE_NAME = os.path.basename(DJANGO_ROOT)

SITE_ID = 1

path.append(DJANGO_ROOT)

DEBUG = False

TEMPLATE_DEBUG = DEBUG

DEV = False

ADMINS = (
    ('Mesteno', 'messteno@gmail.com'),
)

MANAGERS = ADMINS

DATABASES = {}

TIME_ZONE = 'Europe/Moscow'

LANGUAGE_CODE = 'ru-ru'

USE_I18N = True

USE_L10N = True

USE_TZ = True


MEDIA_ROOT = os.path.normpath(os.path.join(SITE_ROOT, '..', 'media'))

MEDIA_URL = '/media/'

STATIC_ROOT = os.path.normpath(os.path.join(SITE_ROOT, '..', 'static'))

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.normpath(os.path.join(SITE_ROOT, '..', 'bower_components')),
    os.path.normpath(os.path.join(SITE_ROOT, '..', 'frontend', 'dist')),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

ALLOWED_HOSTS = []

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.media',
    'django.core.context_processors.request',
    'django.core.context_processors.i18n',
    'django.core.context_processors.static',
    'django.core.context_processors.csrf',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

TEMPLATE_DIRS = (
    os.path.normpath(os.path.join(SITE_ROOT, 'templates')),
)

MIDDLEWARE_CLASSES = (
    # Default Django middleware.
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'htmlmin.middleware.HtmlMinifyMiddleware',
    'htmlmin.middleware.MarkRequestMiddleware',
)

ROOT_URLCONF = '%s.urls' % SITE_NAME

DJANGO_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
)

LOCAL_APPS = (
)

INSTALLED_APPS = DJANGO_APPS + LOCAL_APPS

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

WSGI_APPLICATION = '%s.wsgi.application' % SITE_NAME

INTERNAL_IPS = ('127.0.0.1',)

INSTALLED_APPS += (
    'compressor',
)

COMPRESS_ROOT = os.path.normpath(os.path.join(SITE_ROOT, '..', 'frontend', 'dist'))
COMPRESS_OUTPUT_DIR = ''