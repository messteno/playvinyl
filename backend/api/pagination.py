import math
from rest_framework.response import Response
from rest_framework import pagination


class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 2

    def get_paginated_response(self, data):
        return Response({
            'links': {
               'next': self.get_next_link(),
               'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'pages': int(math.ceil(float(self.page.paginator.count) / self.page_size)),
            'page_size': self.page_size,
            'results': data
        })
