import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Search } from "lucide-react";
import { apiService, Employee, Department } from "../lib/api";
import { toast } from "sonner";

interface EmployeeWithPerformance extends Employee {
  performance: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
}

function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  if (data?.data) return data.data;
  return [];
}

export function EmployeeTable() {
  const [employees, setEmployees] = useState<EmployeeWithPerformance[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");

  // Static performance data - keep as hardcoded for now
  const performanceMap: { [key: number]: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' } = {
    1: 'Excellent',
    2: 'Excellent',
    3: 'Good',
    4: 'Good',
    5: 'Good',
    6: 'Excellent',
    7: 'Good',
    8: 'Average',
    9: 'Good',
    10: 'Excellent'
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEmployees();
      const employeeArray = ensureArray<Employee>(response.data);
      
      // Add performance data to employees
      const employeesWithPerformance = employeeArray.map(emp => ({
        ...emp,
        performance: performanceMap[emp.id] || 'Good'
      }));
      
      setEmployees(employeesWithPerformance);
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

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || employee.department_name === departmentFilter;
    const matchesPerformance = performanceFilter === "all" || employee.performance === performanceFilter;
    
    return matchesSearch && matchesDepartment && matchesPerformance;
  });

  const getPerformanceBadgeVariant = (performance: string) => {
    switch (performance) {
      case "Excellent": return "default";
      case "Good": return "secondary";
      case "Average": return "outline";
      case "Needs Improvement": return "destructive";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3>Employee Details</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Total Comp</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Start Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading employees...
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No employees found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.full_name}</div>
                      <div className="text-sm text-muted-foreground">ID: {employee.employee_id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department_name}</TableCell>
                  <TableCell>{employee.role || "N/A"}</TableCell>
                  <TableCell>${parseFloat(employee.salary).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>$0</TableCell>
                  <TableCell className="font-medium">
                    ${parseFloat(employee.salary).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPerformanceBadgeVariant(employee.performance)}>
                      {employee.performance}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(employee.hire_date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}