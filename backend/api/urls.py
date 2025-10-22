from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'departments', views.DepartmentViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'leave-requests', views.LeaveRequestViewSet)
router.register(r'job-postings', views.JobPostingViewSet)
router.register(r'job-applications', views.JobApplicationViewSet)

urlpatterns = [
    path('ping/', views.ping, name='ping'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('', include(router.urls)),
]