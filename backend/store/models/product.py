#!/usr/bin/env python
# -*- coding: utf-8 -*-

# from polymorphic.polymorphic_model import PolymorphicModel
from django.db import models
from autoslug import AutoSlugField


class BaseProduct(models.Model):
    name = models.CharField(max_length=255, verbose_name='название')
    slug = AutoSlugField(unique=True, populate_from='name', verbose_name='псевдоним для ссылки')
    active = models.BooleanField(default=True, verbose_name='активен')
    date_added = models.DateTimeField(auto_now_add=True, verbose_name='дата добавления')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='цена')
    stock = models.IntegerField(default=1, verbose_name='количество')

    class Meta(object):
        abstract = True
        app_label = 'shop'
        verbose_name = 'товар'
        verbose_name_plural = 'товары'

    def __unicode__(self):
        return self.name

    @property
    def can_be_added_to_cart(self):
        return self.active
