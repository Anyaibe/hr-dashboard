import { useState } from "react";
import { Sidebar } from "./components/layout/sidebar";
import { Header } from "./components/layout/header";
import { OverviewMetrics } from "./components/dashboard/overview-metrics";
import { LeaveChart } from "./components/dashboard/leave-chart";
import { RecentActivity } from "./components/dashboard/recent-activity";
import { EmployeeManagement } from "./components/employees/employee-management";
import { EmployeeProfile } from "./components/employees/employee-profile";
import { RecruitmentDashboard } from "./components/recruitment/recruitment-dashboard";
import { CandidateProfile } from "./components/recruitment/candidate-profile";
import { LeaveManagement } from "./components/leave/leave-management";
import { AttendanceTracking } from "./components/attendance/attendance-tracking";
import { WorkManagement } from "./components/work/work-management";
import { RemunerationSummary } from "./components/remuneration-summary";
import { SalaryCharts } from "./components/salary-charts";
import { EmployeeTable } from "./components/employee-table";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedCandidate, setSelectedCandidate] = useState<
    string | null
  >(null);
  const [selectedEmployee, setSelectedEmployee] = useState<
    string | null
  >(null);

  const getPageTitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Dashboard";
      case "employees":
        return "Employee Management";
      case "remuneration":
        return "Remuneration";
      case "recruitment":
        return "Recruitment";
      case "leave":
        return "Leave Management";
      case "attendance":
        return "Attendance Tracking";
      case "workplace":
        return "Work Management";
      case "settings":
        return "Account Settings";
      default:
        return "Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Hello, Welcome";
      case "employees":
        return "Manage employee information and profiles";
      case "remuneration":
        return "Comprehensive compensation analysis and employee salary dashboard";
      case "recruitment":
        return "Manage job openings and candidate applications";
      case "leave":
        return "Review and manage employee leave requests";
      case "attendance":
        return "Track employee attendance and working hours";
      case "workplace":
        return "Manage tasks, projects, and performance";
      default:
        return "";
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <OverviewMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeaveChart />
              <div className="space-y-6">
                <RecentActivity />
              </div>
            </div>
          </div>
        );

      case "employees":
        return (
          <EmployeeManagement
            onEmployeeSelect={setSelectedEmployee}
          />
        );

      case "remuneration":
        return (
          <div className="space-y-6">
            <RemunerationSummary />
            <SalaryCharts />
            <EmployeeTable />
          </div>
        );

      case "recruitment":
        return (
          <RecruitmentDashboard
            onCandidateSelect={setSelectedCandidate}
          />
        );

      case "leave":
        return <LeaveManagement />;

      case "attendance":
        return <AttendanceTracking />;

      case "workplace":
        return <WorkManagement />;

      case "settings":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              Account settings coming soon...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
        />

        <main className="flex-1 overflow-auto p-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Modals */}
      {selectedCandidate && (
        <CandidateProfile
          candidateId={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {selectedEmployee && (
        <EmployeeProfile
          employeeId={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}