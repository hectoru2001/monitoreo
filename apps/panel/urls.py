from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('public/', views.index_publico, name='panel_publico'),
    path('ping-status/', views.status_ping, name='ping_status'),
]
