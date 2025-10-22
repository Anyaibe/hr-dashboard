import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Users, Clock, Briefcase, FileText } from "lucide-react";
import { apiService, DashboardStats } from "../../lib/api";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 
                     changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground';
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-semibold">{value}</span>
            {change && <span className={`text-sm ${changeColor}`}>{change}</span>}
          </div>
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function OverviewMetrics() {
  const [stats, setStats] = useState<DashboardStats>({
    employees_on_leave: 0,
    pending_requests: 0,
    open_positions: 0,
    pending_applications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Employees On Leave"
        value={stats.employees_on_leave.toString()}
        change="+2 this week"
        changeType="neutral"
        icon={<Users className="h-8 w-8" />}
      />
      <MetricCard
        title="Pending Requests"
        value={stats.pending_requests.toString()}
        change="+3 today"
        changeType="neutral"
        icon={<Clock className="h-8 w-8" />}
      />
      <MetricCard
        title="Open Positions"
        value={stats.open_positions.toString()}
        change="+1 this month"
        changeType="positive"
        icon={<Briefcase className="h-8 w-8" />}
      />
      <MetricCard
        title="Pending Applications"
        value={stats.pending_applications.toString()}
        change="+15 this week"
        changeType="positive"
        icon={<FileText className="h-8 w-8" />}
      />
    </div>
  );
}