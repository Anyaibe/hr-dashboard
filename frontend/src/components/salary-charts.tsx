import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { apiService, Employee, Department } from "../lib/api";

function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  if (data?.data) return data.data;
  return [];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Static data for salary trend (historical data not in database)
const salaryTrendData = [
  { year: "2020", avgSalary: 75000 },
  { year: "2021", avgSalary: 78500 },
  { year: "2022", avgSalary: 82000 },
  { year: "2023", avgSalary: 85200 },
  { year: "2024", avgSalary: 87500 }
];

export function SalaryCharts() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeeResponse, departmentResponse] = await Promise.all([
        apiService.getEmployees(),
        apiService.getDepartments()
      ]);
      
      const employeeArray = ensureArray<Employee>(employeeResponse.data);
      const departmentArray = ensureArray<Department>(departmentResponse.data);
      
      setEmployees(employeeArray);
      setDepartments(departmentArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate salary distribution from actual employee data
  const calculateSalaryDistribution = () => {
    const ranges = [
      { range: "$40-60k", min: 40000, max: 60000, count: 0 },
      { range: "$60-80k", min: 60000, max: 80000, count: 0 },
      { range: "$80-100k", min: 80000, max: 100000, count: 0 },
      { range: "$100-120k", min: 100000, max: 120000, count: 0 },
      { range: "$120-150k", min: 120000, max: 150000, count: 0 },
      { range: "$150k+", min: 150000, max: Infinity, count: 0 }
    ];

    employees.forEach(emp => {
      const salary = parseFloat(emp.salary);
      const rangeItem = ranges.find(r => salary >= r.min && salary < r.max);
      if (rangeItem) rangeItem.count++;
    });

    return ranges.map(({ range, count }) => ({ range, count }));
  };

  // Calculate department breakdown from actual employee data
  const calculateDepartmentData = () => {
    if (departments.length === 0 || employees.length === 0) return [];

    const departmentStats = departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept.id);
      const totalSalary = deptEmployees.reduce((sum, emp) => sum + parseFloat(emp.salary), 0);
      const avgSalary = deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0;

      return {
        department: dept.name,
        avgSalary: Math.round(avgSalary),
        employees: deptEmployees.length
      };
    }).filter(dept => dept.employees > 0); // Only show departments with employees

    return departmentStats;
  };

  const salaryDistributionData = calculateSalaryDistribution();
  const departmentData = calculateDepartmentData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="mb-4">Salary Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salaryDistributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Department Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          {departmentData.length > 0 ? (
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, employees }) => `${department} (${employees})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="employees"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Average Salary by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          {departmentData.length > 0 ? (
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg Salary']} />
              <Bar dataKey="avgSalary" fill="#00C49F" />
            </BarChart>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Salary Trend (5 Years)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salaryTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg Salary']} />
            <Line type="monotone" dataKey="avgSalary" stroke="#FF8042" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}