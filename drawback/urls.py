from django.contrib import admin
from django.urls import path
from drawsocket import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('GetThread/<str:thread_name>/', views.GetPatterns.as_view()),
    path('availableThreads/', views.All_Threads.as_view()),
    path('Clear/<str:thread_name>/', views.Clear_Thread.as_view()),
    path('', views.CentralCore),
    path('drawing/<str:thread_name>', views.CentralCore)
]