import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash2, Filter } from "lucide-react";
import { AddEmployeeForm } from "./add-employee-form";
import { EditEmployeeForm } from "./edit-employee-form";
import { toast } from "sonner";
import { apiService, Employee } from "../../lib/api";

interface EmployeeManagementProps {
  onEmployeeSelect: (id: string | null) => void;
}

function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export function EmployeeManagement({ onEmployeeSelect }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, filterStatus, employees]);

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

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department_name && emp.department_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(emp => emp.status === filterStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = async (data: Partial<Employee>) => {
    try {
      await apiService.createEmployee(data);
      toast.success('Employee added successfully');
      setShowAddForm(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
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
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await apiService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      terminated: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-10 bg-muted rounded w-64"></div>
              <div className="h-10 bg-muted rounded w-32"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Employees</span>
            <span className="text-2xl font-bold">{employees.length}</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Active</span>
            <span className="text-2xl font-bold text-green-600">
              {employees.filter(e => e.status === 'active').length}
            </span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Inactive</span>
            <span className="text-2xl font-bold text-yellow-600">
              {employees.filter(e => e.status === 'inactive').length}
            </span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Terminated</span>
            <span className="text-2xl font-bold text-red-600">
              {employees.filter(e => e.status === 'terminated').length}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header with Search and Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Employee Directory</h2>
            <Button onClick={() => setShowAddForm(true)} size="default">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground">
                          {employees.length === 0 
                            ? 'No employees found. Click "Add Employee" to create one.' 
                            : 'No employees match your search criteria.'}
                        </p>
                        {employees.length === 0 && (
                          <Button onClick={() => setShowAddForm(true)} variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Your First Employee
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {employee.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {employee.department_name || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {employee.phone || 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(employee.hire_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onEmployeeSelect(employee.id.toString())}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Employee
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Employee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Info */}
          {filteredEmployees.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredEmployees.length} of {employees.length} employee(s)
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      {showAddForm && (
        <AddEmployeeForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddEmployee}
        />
      )}

      {editingEmployee && (
        <EditEmployeeForm
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSubmit={handleEditEmployee}
        />
      )}
    </div>
  );
}