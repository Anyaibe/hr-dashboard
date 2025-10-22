from django.contrib import admin
from .models import Department, Employee, LeaveRequest, JobPosting, JobApplication


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'department', 'status', 'hire_date')
    list_filter = ('department', 'status', 'hire_date')
    search_fields = ('first_name', 'last_name', 'email')


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'start_date', 'end_date', 'status')
    list_filter = ('leave_type', 'status', 'start_date')
    search_fields = ('employee__first_name', 'employee__last_name')


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'is_active', 'created_at')
    list_filter = ('department', 'is_active')
    search_fields = ('title', 'description')


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('candidate_name', 'job_posting', 'status', 'rating', 'created_at')
    list_filter = ('status', 'job_posting', 'rating')
    search_fields = ('candidate_name', 'candidate_email')