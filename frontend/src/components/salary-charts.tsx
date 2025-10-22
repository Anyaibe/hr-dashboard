import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const salaryDistributionData = [
  { range: "$40-60k", count: 15 },
  { range: "$60-80k", count: 32 },
  { range: "$80-100k", count: 28 },
  { range: "$100-120k", count: 24 },
  { range: "$120-150k", count: 18 },
  { range: "$150k+", count: 25 }
];

const departmentData = [
  { department: "Engineering", avgSalary: 105000, employees: 45 },
  { department: "Sales", avgSalary: 78000, employees: 28 },
  { department: "Marketing", avgSalary: 72000, employees: 18 },
  { department: "Operations", avgSalary: 65000, employees: 22 },
  { department: "HR", avgSalary: 68000, employees: 12 },
  { department: "Finance", avgSalary: 85000, employees: 17 }
];

const salaryTrendData = [
  { year: "2020", avgSalary: 75000 },
  { year: "2021", avgSalary: 78500 },
  { year: "2022", avgSalary: 82000 },
  { year: "2023", avgSalary: 85200 },
  { year: "2024", avgSalary: 87500 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function SalaryCharts() {
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
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Average Salary by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg Salary']} />
            <Bar dataKey="avgSalary" fill="#00C49F" />
          </BarChart>
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