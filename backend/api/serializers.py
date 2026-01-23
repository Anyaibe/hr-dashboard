from rest_framework import serializers
from .models import Department, Employee, LeaveRequest, JobPosting, JobApplication


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = '__all__'


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    employee_last_name = serializers.CharField(source='employee.last_name', read_only=True)
    department_name = serializers.CharField(source='employee.department.name', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'


class JobPostingSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = JobPosting
        fields = '__all__'


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job_posting.title', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'


class DashboardStatsSerializer(serializers.Serializer):
    employees_on_leave = serializers.IntegerField()
    pending_requests = serializers.IntegerField()
    open_positions = serializers.IntegerField()
    pending_applications = serializers.IntegerField()