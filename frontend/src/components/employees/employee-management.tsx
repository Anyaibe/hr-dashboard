import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, Search, Filter, Download, Users, UserPlus, Building2, Calendar, MoreHorizontal, Eye, Edit2, RefreshCw, Trash2 } from "lucide-react";
import { AddEmployeeForm } from "./add-employee-form";
import { EditEmployeeForm } from "./edit-employee-form";
import { EmployeeProfile } from "./employee-profile";
import { AdvancedFilterModal } from "./advanced-filter-modal";
import { toast } from "sonner";
import { apiService, Employee, Department } from "../../lib/api";

interface EmployeeManagementProps {
  onEmployeeSelect: (id: string | null) => void;
}

export interface FilterState {
  departments: string[];
  employmentTypes: string[];
  statuses: string[];
  gender: string;
}

function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  if (data?.data) return data.data;
  return [];
}

export function EmployeeManagement({ onEmployeeSelect }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterEmploymentType, setFilterEmploymentType] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    departments: [],
    employmentTypes: [],
    statuses: [],
    gender: "all"
  });
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, filterDepartment, filterEmploymentType, advancedFilters, employees]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('button[aria-label="actions"]')) {
          setActionMenuOpen(null);
        }
      }
    };

    if (actionMenuOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [actionMenuOpen]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEmployees();
      const arr = ensureArray<Employee>(response.data);
      setEmployees(arr);
      setFilteredEmployees(arr);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await apiService.getDepartments();
      const arr = ensureArray<Department>(response.data);
      setDepartments(arr);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment !== "all") {
      filtered = filtered.filter(emp => emp.department.toString() === filterDepartment);
    }

    if (filterEmploymentType !== "all") {
      filtered = filtered.filter(emp => emp.employment_type === filterEmploymentType);
    }

    if (advancedFilters.departments.length > 0) {
      filtered = filtered.filter(emp => 
        advancedFilters.departments.includes(emp.department.toString())
      );
    }

    if (advancedFilters.employmentTypes.length > 0) {
      filtered = filtered.filter(emp => 
        advancedFilters.employmentTypes.includes(emp.employment_type || 'full-time')
      );
    }

    if (advancedFilters.statuses.length > 0) {
      filtered = filtered.filter(emp => 
        advancedFilters.statuses.includes(emp.status)
      );
    }

    if (advancedFilters.gender !== "all") {
      filtered = filtered.filter(emp => emp.gender === advancedFilters.gender);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = async (data: Partial<Employee>) => {
    try {
      await apiService.createEmployee(data);
      toast.success('Employee added successfully');
      setShowAddForm(false);
      fetchEmployees();
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast.error(error.response?.data?.email?.[0] || 'Failed to add employee');
      throw error;
    }
  };

  const handleEditEmployee = async (data: Partial<Employee>) => {
    if (!editingEmployee) return;
    
    try {
      await apiService.updateEmployee(editingEmployee.id, data);
      toast.success('Employee updated successfully');
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
      throw error;
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
    
    try {
      await apiService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      setActionMenuOpen(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const handleApplyAdvancedFilters = (filters: FilterState) => {
    setAdvancedFilters(filters);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Gender', 'Role', 'Department', 'Type', 'Status', 'Email', 'Phone'];
    const csvData = filteredEmployees.map(emp => [
      emp.employee_id,
      emp.full_name,
      emp.gender || 'N/A',
      emp.role || 'N/A',
      emp.department_name,
      emp.employment_type || 'full-time',
      emp.status,
      emp.email,
      emp.phone || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Employee data exported successfully');
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: "bg-green-50 text-green-700 border-green-200",
      inactive: "bg-yellow-50 text-yellow-700 border-yellow-200",
      terminated: "bg-red-50 text-red-700 border-red-200"
    };
    const className = config[status as keyof typeof config] || config.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getNewHiresCount = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return employees.filter(emp => {
      const hireDate = new Date(emp.hire_date);
      return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
    }).length;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <h3 className="text-3xl font-bold mt-1">{employees.length}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Hires</p>
                <h3 className="text-3xl font-bold mt-1">{getNewHiresCount()}</h3>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Departments</p>
                <h3 className="text-3xl font-bold mt-1">{departments.length}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">On Leave</p>
                <h3 className="text-3xl font-bold mt-1">12</h3>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white border">
        <div className="p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Employee Directory</h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Search by name, role, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 h-10"
                />
              </div>

              {/* Department Filter */}
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="h-10 px-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </option>
                ))}
              </select>

              {/* Employment Type Filter */}
              <select
                value={filterEmploymentType}
                onChange={(e) => setFilterEmploymentType(e.target.value)}
                className="h-10 px-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>

              {/* Filters Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAdvancedFilters(true)}
                className="h-10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Export CSV Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCSV}
                className="h-10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              {/* Add Employee Button */}
              <Button 
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="h-10 !bg-black hover:!bg-gray-800 !text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Gender</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role</TableHead>
                  <TableHead className="font-semibold text-gray-700">Department</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <Users className="h-16 w-16 opacity-20" />
                        <div>
                          <p className="font-medium">No employees found</p>
                          <p className="text-sm mt-1">
                            {employees.length === 0 
                              ? 'Get started by adding your first employee.' 
                              : 'Try adjusting your search or filters.'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {employee.employee_id || `EMP${String(employee.id).padStart(3, '0')}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {(employee.first_name?.charAt(0) || '?').toUpperCase()}{(employee.last_name?.charAt(0) || '?').toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {employee.full_name || `${employee.first_name} ${employee.last_name}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 capitalize">{employee.gender || '-'}</TableCell>
                      <TableCell className="text-gray-700">{employee.role || '-'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {employee.department_name}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700 capitalize">
                        {employee.employment_type?.replace('-', ' ') || 'Full-time'}
                      </TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="relative inline-flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuOpen(actionMenuOpen === employee.id ? null : employee.id);
                            }}
                            className="h-8 w-8 rounded-md transition-colors duration-150 flex items-center justify-center"
                            style={{ 
                              border: 'none', 
                              background: 'transparent',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </button>
                          
                          {actionMenuOpen === employee.id && (
                            <>
                              {/* Backdrop with fade-in */}
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setActionMenuOpen(null)}
                                style={{
                                  animation: 'fadeIn 200ms ease-out'
                                }}
                              />

                              {/* Dropdown Menu with fade + slide transition */}
                              <div 
                                ref={dropdownRef}
                                className="absolute rounded-lg shadow-lg z-50"
                                style={{ 
                                  backgroundColor: '#ffffff',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                  border: '1px solid #e5e7eb',
                                  width: '150px',
                                  // Fade + slide animation
                                  animation: filteredEmployees.indexOf(employee) >= filteredEmployees.length - 2
                                    ? 'fadeSlideUp 250ms ease-out'
                                    : 'fadeSlideDown 250ms ease-out',
                                  // Smart positioning
                                  ...(filteredEmployees.indexOf(employee) >= filteredEmployees.length - 2
                                    ? { bottom: '100%', marginBottom: '4px', right: '35px' }
                                    : { top: '100%', marginTop: '3px', right: '35px' })
                                }}
                              >
                                <div style={{ padding: '4px' }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingEmployee(employee);
                                      setActionMenuOpen(null);
                                    }}
                                    className="flex items-center text-sm text-gray-700 transition-all duration-150"
                                    style={{ 
                                      backgroundColor: 'transparent',
                                      borderRadius: '6px',
                                      padding: '2px 16px',
                                      border: 'none',
                                      cursor: 'pointer',
                                      width: '100%',
                                      justifyContent: 'flex-start',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <Eye className="h-3.5 w-4 text-gray-600 flex-shrink-0" style={{ marginRight: '14px' }} />
                                    <span style={{ whiteSpace: 'nowrap', fontSize: '13.5px' }}>View Profile</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingEmployee(employee);
                                      setActionMenuOpen(null);
                                    }}
                                    className="flex items-center text-sm text-gray-700 transition-all duration-150"
                                    style={{ 
                                      backgroundColor: 'transparent',
                                      borderRadius: '6px',
                                      padding: '2px 16px',
                                      border: 'none',
                                      cursor: 'pointer',
                                      width: '100%',
                                      justifyContent: 'flex-start',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <Edit2 className="h-3.5 w-4 text-gray-600 flex-shrink-0" style={{ marginRight: '14px' }} />
                                    <span style={{ whiteSpace: 'nowrap', fontSize: '13.5px' }}>Edit Details</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.info('Update Status feature coming soon');
                                      setActionMenuOpen(null);
                                    }}
                                    className="flex items-center text-sm text-gray-700 transition-all duration-150"
                                    style={{ 
                                      backgroundColor: 'transparent',
                                      borderRadius: '6px',
                                      padding: '2px 16px',
                                      border: 'none',
                                      cursor: 'pointer',
                                      width: '100%',
                                      justifyContent: 'flex-start'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <RefreshCw className="h-4 w-4 text-gray-600 flex-shrink-0" style={{ marginRight: '14px' }} />
                                    <span style={{ whiteSpace: 'nowrap', fontSize: '13.5px' }}>Update Status</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          {filteredEmployees.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <p>
                Showing <span className="font-medium text-gray-900">{filteredEmployees.length}</span> of{' '}
                <span className="font-medium text-gray-900">{employees.length}</span> employees
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      {showAddForm && (
        <AddEmployeeForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddEmployee}
          departments={departments}
        />
      )}

      {editingEmployee && (
        <EditEmployeeForm
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSubmit={handleEditEmployee}
          departments={departments}
        />
      )}

      {viewingEmployee && (
        <EmployeeProfile
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(null)}
        />
      )}

      {showAdvancedFilters && (
        <AdvancedFilterModal
          onClose={() => setShowAdvancedFilters(false)}
          onApply={handleApplyAdvancedFilters}
          departments={departments}
        />
      )}
    </div>
  );
}