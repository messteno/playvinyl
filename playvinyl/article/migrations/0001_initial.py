# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('title', models.TextField(verbose_name='Заголовок', default='Title')),
                ('content', models.TextField(verbose_name='Содержание', default='Content')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
