import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  User, 
  IdCard,
  Clock,
  DollarSign,
  MoreHorizontal,
  Check,
  X,
  Eye
} from "lucide-react";

interface EmployeeProfileProps {
  employeeId: string;
  onClose: () => void;
}

export function EmployeeProfile({ employeeId, onClose }: EmployeeProfileProps) {
  // Mock employee data - in real app this would be fetched based on employeeId
  const employee = {
    id: "EMP001",
    name: "Sarah Johnson",
    position: "Senior Developer",
    department: "Engineering",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    dateOfBirth: "1990-05-15",
    gender: "Female",
    maritalStatus: "Single",
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Brother",
      phone: "+1 (555) 987-6543"
    },
    employmentType: "Full-time",
    startDate: "2021-03-15",
    salary: 115000,
    manager: "Michael Chen",
    workLocation: "New York Office",
    workingHours: "9:00 AM - 5:00 PM",
    status: "Active"
  };

  const leaveHistory = [
    { id: "1", type: "Annual Leave", startDate: "2024-05-15", endDate: "2024-05-20", days: 5, status: "Approved", reason: "Family vacation" },
    { id: "2", type: "Sick Leave", startDate: "2024-04-10", endDate: "2024-04-12", days: 2, status: "Approved", reason: "Medical appointment" },
    { id: "3", type: "Personal Leave", startDate: "2024-03-25", endDate: "2024-03-25", days: 1, status: "Approved", reason: "Personal matters" },
    { id: "4", type: "Annual Leave", startDate: "2024-06-20", endDate: "2024-06-25", days: 5, status: "Pending", reason: "Summer vacation" },
  ];

  const compensationHistory = [
    { date: "2024-01-01", type: "Base Salary", amount: 115000, description: "Annual salary review increase" },
    { date: "2023-12-15", type: "Performance Bonus", amount: 15000, description: "Year-end performance bonus" },
    { date: "2023-01-01", type: "Base Salary", amount: 105000, description: "Promotion to Senior Developer" },
    { date: "2022-12-15", type: "Holiday Bonus", amount: 3000, description: "Holiday bonus" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge variant="secondary" className="bg-green-100 text-green-800">{status}</Badge>;
      case "Pending": return <Badge variant="outline">{status}</Badge>;
      case "Rejected": return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case "Annual Leave": return <Badge variant="default">{type}</Badge>;
      case "Sick Leave": return <Badge variant="secondary">{type}</Badge>;
      case "Personal Leave": return <Badge variant="outline">{type}</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.position} • {employee.department}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {employee.status}
          </Badge>
        </div>

        <div className="p-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="professional">Professional Information</TabsTrigger>
              <TabsTrigger value="leave">Leave History</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="mt-1">{employee.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="mt-1">{new Date(employee.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="mt-1">{employee.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                      <p className="mt-1">{employee.maritalStatus}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p>{employee.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p>{employee.phone}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p>{employee.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="mt-1">{employee.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                    <p className="mt-1">{employee.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="mt-1">{employee.emergencyContact.phone}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Employment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IdCard className="h-4 w-4 text-muted-foreground" />
                        <p>{employee.id}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Position</label>
                      <p className="mt-1">{employee.position}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <p className="mt-1">{employee.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                      <p className="mt-1">{employee.employmentType}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p>{new Date(employee.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Manager</label>
                      <p className="mt-1">{employee.manager}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Work Location</label>
                      <p className="mt-1">{employee.workLocation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Working Hours</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p>{employee.workingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Current Compensation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Base Salary</label>
                    <p className="mt-1 text-lg font-semibold">${employee.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                    <p className="mt-1">{employee.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Review</label>
                    <p className="mt-1">January 2024</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="leave" className="space-y-6 mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Leave Request History</h3>
                  <div className="text-sm text-muted-foreground">
                    Total leave days this year: {leaveHistory.filter(l => l.status === "Approved").reduce((sum, leave) => sum + leave.days, 0)} days
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveHistory.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>{getLeaveTypeBadge(leave.type)}</TableCell>
                          <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                          <TableCell>{leave.days}</TableCell>
                          <TableCell>{getStatusBadge(leave.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {leave.status === "Pending" && (
                                  <>
                                    <DropdownMenuItem>
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <X className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="compensation" className="space-y-6 mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Compensation History</h3>
                  <div className="text-sm text-muted-foreground">
                    Total compensation this year: ${compensationHistory.filter(c => c.date.startsWith('2024')).reduce((sum, comp) => sum + comp.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compensationHistory.map((comp, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(comp.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={comp.type === "Base Salary" ? "default" : "secondary"}>
                              {comp.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">${comp.amount.toLocaleString()}</TableCell>
                          <TableCell>{comp.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}