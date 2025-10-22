import { Card } from "./ui/card";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";

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

export function RemunerationSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="Total Annual Payroll"
        value="$12.4M"
        change="+8.2%"
        changeType="positive"
        icon={<DollarSign className="h-8 w-8" />}
      />
      <SummaryCard
        title="Average Salary"
        value="$87,500"
        change="+5.1%"
        changeType="positive"
        icon={<TrendingUp className="h-8 w-8" />}
      />
      <SummaryCard
        title="Total Employees"
        value="142"
        change="+12"
        changeType="positive"
        icon={<Users className="h-8 w-8" />}
      />
      <SummaryCard
        title="Bonus Pool"
        value="$1.8M"
        change="+15.3%"
        changeType="positive"
        icon={<Award className="h-8 w-8" />}
      />
    </div>
  );
}