#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from django.db import models
from django.dispatch import receiver
from django.contrib.auth.models import User
from utils import get_uuid_file_path
from store.models import BaseProduct
from autoslug import AutoSlugField


class Customer(models.Model):
    user = models.OneToOneField(User)


class VinylAuthor(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False, null=False)
    slug = AutoSlugField(unique=True, populate_from='name', verbose_name='псевдоним для ссылки')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'исполнитель'
        verbose_name_plural = 'исполнители'


class VinylLabel(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False, null=False)
    slug = AutoSlugField(unique=True, populate_from='name', verbose_name='псевдоним для ссылки')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'лейбл'
        verbose_name_plural = 'лейблы'


class VinylStyle(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False, null=False)
    slug = AutoSlugField(unique=True, populate_from='name', verbose_name='псевдоним для ссылки')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'стиль'
        verbose_name_plural = 'стили'


class VinylCatalog(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False, null=False)
    slug = AutoSlugField(unique=True, populate_from='name', verbose_name='псевдоним для ссылки')

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = 'каталог'
        verbose_name_plural = 'каталоги'


def get_vinyl_image_path(instance, filename):
    return get_uuid_file_path('image', instance.slug, filename)


class Vinyl(BaseProduct):
    authors = models.ManyToManyField(VinylAuthor, related_name='vinyls', verbose_name='исполнители')
    label = models.ForeignKey(VinylLabel, verbose_name='лейбл')
    styles = models.ManyToManyField(VinylStyle, verbose_name='стили')
    catalog = models.ForeignKey(VinylCatalog, verbose_name='каталог')
    image = models.ImageField(upload_to=get_vinyl_image_path, blank=True, null=True, verbose_name='изображение')
    release_date = models.DateField(verbose_name='дата релиза')
    description = models.TextField(blank=True, null=True, verbose_name='описание')
    catalog_number = models.CharField(max_length=64, blank=True, null=True, verbose_name='номер каталога')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'винил'
        verbose_name_plural = 'винил'


def get_vinyl_track_path(instance, filename):
    return get_uuid_file_path('music', instance.vinyl.slug, filename)


class VinylTrack(models.Model):
    name = models.CharField(max_length=128, blank=False, null=False, verbose_name='название')
    track = models.FileField(upload_to=get_vinyl_track_path,
                            blank=False, null=False)
    vinyl = models.ForeignKey(Vinyl, blank=False, null=False, related_name='tracks')

    class Meta:
        verbose_name = 'трек'
        verbose_name_plural = 'треки'


@receiver(models.signals.post_delete, sender=VinylTrack)
def auto_delete_track_on_delete(sender, instance, **kwargs):
    if instance.track:
        if os.path.isfile(instance.track.path):
            os.remove(instance.track.path)

@receiver(models.signals.pre_save, sender=VinylTrack)
def auto_delete_track_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_track = VinylTrack.objects.get(pk=instance.pk).track
    except VinylTrack.DoesNotExist:
        return False

    if not old_track:
        return False

    new_track = instance.track
    if not old_track == new_track:
        if os.path.isfile(old_track.path):
            os.remove(old_track.path)
