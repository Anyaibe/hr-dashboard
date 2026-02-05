import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";
import { apiService, Employee } from "../lib/api";

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

function SummaryCard({ title, value, change, changeType, icon }: SummaryCardProps) {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 
                     changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground';
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground mb-2">{title}</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-semibold">{value}</span>
            <span className={`text-sm ${changeColor}`}>{change}</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  if (data?.data) return data.data;
  return [];
}

export function RemunerationSummary() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEmployees();
      const arr = ensureArray<Employee>(response.data);
      setEmployees(arr);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from actual employee data
  const calculateMetrics = () => {
    if (employees.length === 0) {
      return {
        totalPayroll: "$0",
        avgSalary: "$0",
        totalEmployees: "0",
        bonusPool: "$0"
      };
    }

    const totalPayroll = employees.reduce((sum, emp) => sum + parseFloat(emp.salary), 0);
    const avgSalary = totalPayroll / employees.length;
    
    return {
      totalPayroll: `$${(totalPayroll / 1000000).toFixed(1)}M`,
      avgSalary: `$${Math.round(avgSalary).toLocaleString('en-US')}`,
      totalEmployees: employees.length.toString(),
      bonusPool: "$0" // Set to 0 as per requirements
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="Total Annual Payroll"
        value={loading ? "..." : metrics.totalPayroll}
        change="+8.2%"
        changeType="positive"
        icon={<DollarSign className="h-8 w-8" />}
      />
      <SummaryCard
        title="Average Salary"
        value={loading ? "..." : metrics.avgSalary}
        change="+5.1%"
        changeType="positive"
        icon={<TrendingUp className="h-8 w-8" />}
      />
      <SummaryCard
        title="Total Employees"
        value={loading ? "..." : metrics.totalEmployees}
        change="+12"
        changeType="positive"
        icon={<Users className="h-8 w-8" />}
      />
      <SummaryCard
        title="Bonus Pool"
        value={metrics.bonusPool}
        change="+15.3%"
        changeType="positive"
        icon={<Award className="h-8 w-8" />}
      />
    </div>
  );
}