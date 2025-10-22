import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  salary: number;
  bonus: number;
  startDate: string;
  performance: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
}

const employeeData: Employee[] = [
  { id: "001", name: "Sarah Johnson", department: "Engineering", position: "Senior Developer", salary: 115000, bonus: 15000, startDate: "2021-03-15", performance: "Excellent" },
  { id: "002", name: "Michael Chen", department: "Engineering", position: "Tech Lead", salary: 135000, bonus: 20000, startDate: "2019-07-22", performance: "Excellent" },
  { id: "003", name: "Emily Rodriguez", department: "Sales", position: "Account Manager", salary: 75000, bonus: 12000, startDate: "2022-01-10", performance: "Good" },
  { id: "004", name: "David Thompson", department: "Marketing", position: "Marketing Manager", salary: 85000, bonus: 8000, startDate: "2020-11-05", performance: "Good" },
  { id: "005", name: "Lisa Wang", department: "Engineering", position: "Junior Developer", salary: 75000, bonus: 5000, startDate: "2023-06-01", performance: "Good" },
  { id: "006", name: "James Wilson", department: "Sales", position: "Sales Director", salary: 120000, bonus: 25000, startDate: "2018-09-12", performance: "Excellent" },
  { id: "007", name: "Anna Martinez", department: "HR", position: "HR Manager", salary: 78000, bonus: 6000, startDate: "2021-08-20", performance: "Good" },
  { id: "008", name: "Robert Kim", department: "Finance", position: "Financial Analyst", salary: 82000, bonus: 7000, startDate: "2022-04-18", performance: "Average" },
  { id: "009", name: "Jennifer Lee", department: "Operations", position: "Operations Manager", salary: 88000, bonus: 9000, startDate: "2020-02-14", performance: "Good" },
  { id: "010", name: "Thomas Anderson", department: "Engineering", position: "Principal Engineer", salary: 155000, bonus: 30000, startDate: "2017-05-03", performance: "Excellent" }
];

export function EmployeeTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");

  const filteredEmployees = employeeData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
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
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
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
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">ID: {employee.id}</div>
                  </div>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>${employee.salary.toLocaleString()}</TableCell>
                <TableCell>${employee.bonus.toLocaleString()}</TableCell>
                <TableCell className="font-medium">
                  ${(employee.salary + employee.bonus).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getPerformanceBadgeVariant(employee.performance)}>
                    {employee.performance}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(employee.startDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredEmployees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No employees found matching your criteria.
        </div>
      )}
    </Card>
  );
}