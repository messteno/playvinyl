#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.db import models


class Article(models.Model):
    title = models.TextField(null=False, blank=False, default='Title',
                             verbose_name=u'Заголовок')
    content = models.TextField(null=False, blank=False, default='Content',
                               verbose_name=u'Содержание')
