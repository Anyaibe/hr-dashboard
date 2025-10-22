from django.utils import timezone
from django.db.models import Count, Q
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import Department, Employee, LeaveRequest, JobPosting, JobApplication
from .serializers import (
    DepartmentSerializer, EmployeeSerializer, LeaveRequestSerializer,
    JobPostingSerializer, JobApplicationSerializer, DashboardStatsSerializer
)


@api_view(['GET'])
def ping(request):
    return Response({'message': 'API is working!', 'status': 'success'})


@api_view(['GET'])
def dashboard_stats(request):
    stats = {
        'employees_on_leave': LeaveRequest.objects.filter(
            status='approved',
            start_date__lte=timezone.now().date(),
            end_date__gte=timezone.now().date()
        ).count(),
        'pending_requests': LeaveRequest.objects.filter(status='pending').count(),
        'open_positions': JobPosting.objects.filter(is_active=True).count(),
        'pending_applications': JobApplication.objects.filter(status='pending').count(),
    }
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('department').all()
    serializer_class = EmployeeSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        department = self.request.query_params.get('department', None)
        status = self.request.query_params.get('status', None)
        
        if department:
            queryset = queryset.filter(department__name__icontains=department)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.select_related('employee', 'employee__department').all()
    serializer_class = LeaveRequestSerializer
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave_request = self.get_object()
        leave_request.status = 'approved'
        leave_request.manager_comments = request.data.get('comments', '')
        leave_request.save()
        serializer = self.get_serializer(leave_request)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        leave_request = self.get_object()
        leave_request.status = 'rejected'
        leave_request.manager_comments = request.data.get('comments', '')
        leave_request.save()
        serializer = self.get_serializer(leave_request)
        return Response(serializer.data)


class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.select_related('department').filter(is_active=True)
    serializer_class = JobPostingSerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.select_related('job_posting').all()
    serializer_class = JobApplicationSerializer
    
    @action(detail=True, methods=['post'])
    def shortlist(self, request, pk=None):
        application = self.get_object()
        application.status = 'shortlisted'
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        application.status = 'rejected'
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)