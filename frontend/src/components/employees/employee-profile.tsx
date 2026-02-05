  import { useState } from "react";
  import { Dialog, DialogContent } from "../ui/dialog";
  import { Button } from "../ui/button";
  import { Badge } from "../ui/badge";
  import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Building2, Clock, DollarSign, FileText, Users } from "lucide-react";
  import { Employee } from "../../lib/api";

  interface EmployeeProfileProps {
    employee: Employee;
    onClose: () => void;
  }

  export function EmployeeProfile({ employee, onClose }: EmployeeProfileProps) {
    const [activeTab, setActiveTab] = useState("personal");

    const getStatusBadge = (status: string) => {
      const config = {
        active: "bg-green-50 text-green-700 border-green-200",
        inactive: "bg-yellow-50 text-yellow-700 border-yellow-200",
        terminated: "bg-red-50 text-red-700 border-red-200"
      };
      const className = config[status as keyof typeof config] || config.active;
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 !bg-white">
          {/* Header */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 hover:bg-gray-200 mt-1"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">{employee.full_name}</h2>
                <p className="text-gray-600 mt-1">
                  {employee.role || 'Employee'} • {employee.department_name}
                </p>
              </div>
              {getStatusBadge(employee.status)}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-6 bg-white p-1 rounded-lg border">
              {[
                { id: "personal", label: "Personal Information" },
                { id: "professional", label: "Professional Information" },
                { id: "leave", label: "Leave History" },
                { id: "compensation", label: "Compensation" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 240px)" }}>
            {activeTab === "personal" && (
              <div className="space-y-8">
                {/* Personal Details Section */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Full Name</div>
                      <div className="text-base font-medium text-gray-900">{employee.full_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Email Address</div>
                      <div className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {employee.email}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Date of Birth</div>
                      <div className="text-base font-medium text-gray-900">
                        {formatDate(employee.date_of_birth || "")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Phone Number</div>
                      <div className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {employee.phone || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Gender</div>
                      <div className="text-base font-medium text-gray-900 capitalize">
                        {employee.gender || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Address</div>
                      <div className="text-base font-medium text-gray-900 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{employee.address || "N/A"}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Marital Status</div>
                      <div className="text-base font-medium text-gray-900">Single</div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="pt-6 border-t">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-600" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Contact Name</div>
                      <div className="text-base font-medium text-gray-900">Jane Doe</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Contact Phone</div>
                      <div className="text-base font-medium text-gray-900">+1 (555) 987-6543</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Relationship</div>
                      <div className="text-base font-medium text-gray-900">Spouse</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="space-y-8">
                {/* Employment Information Section */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-600" />
                    Employment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Employee ID</div>
                      <div className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        {employee.employee_id}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Start Date</div>
                      <div className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(employee.hire_date)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Position</div>
                      <div className="text-base font-medium text-gray-900">{employee.role || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Manager</div>
                      <div className="text-base font-medium text-gray-900">Michael Chen</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Department</div>
                      <div className="text-base font-medium text-gray-900">{employee.department_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Work Location</div>
                      <div className="text-base font-medium text-gray-900">New York Office</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Employment Type</div>
                      <div className="text-base font-medium text-gray-900 capitalize">
                        {employee.employment_type?.replace('-', ' ') || 'Full-time'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Working Hours</div>
                      <div className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        9:00 AM - 5:00 PM
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract & Compensation Section */}
                <div className="pt-6 border-t">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Contract & Compensation
                  </h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Annual Salary</div>
                      <div className="text-base font-medium text-gray-900">
                        ${parseFloat(employee.salary).toLocaleString('en-US')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Contract Type</div>
                      <div className="text-base font-medium text-gray-900">Permanent</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Probation Period</div>
                      <div className="text-base font-medium text-gray-900">3 Months</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1.5">Benefits</div>
                      <div className="text-base font-medium text-gray-900">Health, Dental, 401k</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "leave" && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leave History</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  This employee hasn't taken any leave yet. Leave records will appear here once they submit a leave request.
                </p>
              </div>
            )}

            {activeTab === "compensation" && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Compensation Details</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Detailed compensation history including bonuses, raises, and benefits will be displayed here.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }