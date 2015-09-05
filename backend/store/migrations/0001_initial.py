# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import autoslug.fields
import store.models.vinyl
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Vinyl',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, verbose_name=b'\xd0\xbd\xd0\xb0\xd0\xb7\xd0\xb2\xd0\xb0\xd0\xbd\xd0\xb8\xd0\xb5')),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from=b'name', unique=True, verbose_name=b'\xd0\xbf\xd1\x81\xd0\xb5\xd0\xb2\xd0\xb4\xd0\xbe\xd0\xbd\xd0\xb8\xd0\xbc \xd0\xb4\xd0\xbb\xd1\x8f \xd1\x81\xd1\x81\xd1\x8b\xd0\xbb\xd0\xba\xd0\xb8')),
                ('active', models.BooleanField(default=True, verbose_name=b'\xd0\xb0\xd0\xba\xd1\x82\xd0\xb8\xd0\xb2\xd0\xb5\xd0\xbd')),
                ('date_added', models.DateTimeField(auto_now_add=True, verbose_name=b'\xd0\xb4\xd0\xb0\xd1\x82\xd0\xb0 \xd0\xb4\xd0\xbe\xd0\xb1\xd0\xb0\xd0\xb2\xd0\xbb\xd0\xb5\xd0\xbd\xd0\xb8\xd1\x8f')),
                ('price', models.DecimalField(verbose_name=b'\xd1\x86\xd0\xb5\xd0\xbd\xd0\xb0', max_digits=12, decimal_places=2)),
                ('stock', models.IntegerField(default=1, verbose_name=b'\xd0\xba\xd0\xbe\xd0\xbb\xd0\xb8\xd1\x87\xd0\xb5\xd1\x81\xd1\x82\xd0\xb2\xd0\xbe')),
                ('image', models.ImageField(upload_to=store.models.vinyl.get_vinyl_image_path, null=True, verbose_name=b'\xd0\xb8\xd0\xb7\xd0\xbe\xd1\x8e\xd1\x80\xd0\xb0\xd0\xb6\xd0\xb5\xd0\xbd\xd0\xb8\xd0\xb5', blank=True)),
                ('release_date', models.DateField(verbose_name=b'\xd0\xb4\xd0\xb0\xd1\x82\xd0\xb0 \xd1\x80\xd0\xb5\xd0\xbb\xd0\xb8\xd0\xb7\xd0\xb0')),
                ('description', models.TextField(null=True, verbose_name=b'\xd0\xbe\xd0\xbf\xd0\xb8\xd1\x81\xd0\xb0\xd0\xbd\xd0\xb8\xd0\xb5', blank=True)),
                ('catalog_number', models.CharField(max_length=64, null=True, verbose_name=b'\xd0\xbd\xd0\xbe\xd0\xbc\xd0\xb5\xd1\x80 \xd0\xba\xd0\xb0\xd1\x82\xd0\xb0\xd0\xbb\xd0\xbe\xd0\xb3\xd0\xb0', blank=True)),
            ],
            options={
                'verbose_name': '\u0432\u0438\u043d\u0438\u043b',
                'verbose_name_plural': '\u0432\u0438\u043d\u0438\u043b',
            },
        ),
        migrations.CreateModel(
            name='VinylAuthor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=64)),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from=b'name', unique=True, verbose_name=b'\xd0\xbf\xd1\x81\xd0\xb5\xd0\xb2\xd0\xb4\xd0\xbe\xd0\xbd\xd0\xb8\xd0\xbc \xd0\xb4\xd0\xbb\xd1\x8f \xd1\x81\xd1\x81\xd1\x8b\xd0\xbb\xd0\xba\xd0\xb8')),
            ],
            options={
                'verbose_name': '\u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c',
                'verbose_name_plural': '\u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u0438',
            },
        ),
        migrations.CreateModel(
            name='VinylCatalog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=64)),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from=b'name', unique=True, verbose_name=b'\xd0\xbf\xd1\x81\xd0\xb5\xd0\xb2\xd0\xb4\xd0\xbe\xd0\xbd\xd0\xb8\xd0\xbc \xd0\xb4\xd0\xbb\xd1\x8f \xd1\x81\xd1\x81\xd1\x8b\xd0\xbb\xd0\xba\xd0\xb8')),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': '\u043a\u0430\u0442\u0430\u043b\u043e\u0433',
                'verbose_name_plural': '\u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0438',
            },
        ),
        migrations.CreateModel(
            name='VinylLabel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=64)),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from=b'name', unique=True, verbose_name=b'\xd0\xbf\xd1\x81\xd0\xb5\xd0\xb2\xd0\xb4\xd0\xbe\xd0\xbd\xd0\xb8\xd0\xbc \xd0\xb4\xd0\xbb\xd1\x8f \xd1\x81\xd1\x81\xd1\x8b\xd0\xbb\xd0\xba\xd0\xb8')),
            ],
            options={
                'verbose_name': '\u043b\u0435\u0439\u0431\u043b',
                'verbose_name_plural': '\u043b\u0435\u0439\u0431\u043b\u044b',
            },
        ),
        migrations.CreateModel(
            name='VinylStyle',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=64)),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from=b'name', unique=True, verbose_name=b'\xd0\xbf\xd1\x81\xd0\xb5\xd0\xb2\xd0\xb4\xd0\xbe\xd0\xbd\xd0\xb8\xd0\xbc \xd0\xb4\xd0\xbb\xd1\x8f \xd1\x81\xd1\x81\xd1\x8b\xd0\xbb\xd0\xba\xd0\xb8')),
            ],
            options={
                'verbose_name': '\u0441\u0442\u0438\u043b\u044c',
                'verbose_name_plural': '\u0441\u0442\u0438\u043b\u0438',
            },
        ),
        migrations.CreateModel(
            name='VinylTrack',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, verbose_name=b'\xd0\xbd\xd0\xb0\xd0\xb7\xd0\xb2\xd0\xb0\xd0\xbd\xd0\xb8\xd0\xb5')),
                ('track', models.FileField(upload_to=store.models.vinyl.get_vinyl_track_path)),
                ('vinyl', models.ForeignKey(related_name='tracks', to='store.Vinyl')),
            ],
            options={
                'verbose_name': '\u0442\u0440\u0435\u043a',
                'verbose_name_plural': '\u0442\u0440\u0435\u043a\u0438',
            },
        ),
        migrations.AddField(
            model_name='vinyl',
            name='authors',
            field=models.ManyToManyField(related_name='vinyls', verbose_name=b'\xd0\xb8\xd1\x81\xd0\xbf\xd0\xbe\xd0\xbb\xd0\xbd\xd0\xb8\xd1\x82\xd0\xb5\xd0\xbb\xd0\xb8', to='store.VinylAuthor'),
        ),
        migrations.AddField(
            model_name='vinyl',
            name='catalog',
            field=models.ForeignKey(verbose_name=b'\xd0\xba\xd0\xb0\xd1\x82\xd0\xb0\xd0\xbb\xd0\xbe\xd0\xb3', to='store.VinylCatalog'),
        ),
        migrations.AddField(
            model_name='vinyl',
            name='label',
            field=models.ForeignKey(verbose_name=b'\xd0\xbb\xd0\xb5\xd0\xb9\xd0\xb1\xd0\xbb', to='store.VinylLabel'),
        ),
        migrations.AddField(
            model_name='vinyl',
            name='styles',
            field=models.ManyToManyField(to='store.VinylStyle', verbose_name=b'\xd1\x81\xd1\x82\xd0\xb8\xd0\xbb\xd0\xb8'),
        ),
    ]
