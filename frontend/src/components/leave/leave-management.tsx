import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Search, MoreHorizontal, Check, X, Eye, Filter } from "lucide-react";
import { toast } from "sonner";
import { AdvancedFilter, FilterOption, FilterValues } from "../ui/advanced-filter";

const leaveRequests = [
  { id: "1", date: "2024-06-15", employee: "Sarah Johnson", department: "Engineering", leaveType: "Annual Leave", startDate: "2024-06-20", endDate: "2024-06-25", days: 5, status: "Pending", reason: "Family vacation" },
  { id: "2", date: "2024-06-14", employee: "Michael Chen", department: "Engineering", leaveType: "Sick Leave", startDate: "2024-06-14", endDate: "2024-06-14", days: 1, status: "Approved", reason: "Medical appointment" },
  { id: "3", date: "2024-06-13", employee: "Emily Rodriguez", department: "Sales", leaveType: "Personal Leave", startDate: "2024-06-18", endDate: "2024-06-18", days: 1, status: "Pending", reason: "Personal matters" },
  { id: "4", date: "2024-06-12", employee: "David Thompson", department: "Marketing", leaveType: "Annual Leave", startDate: "2024-07-01", endDate: "2024-07-05", days: 5, status: "Pending", reason: "Summer vacation" },
  { id: "5", date: "2024-06-11", employee: "Lisa Wang", department: "Engineering", leaveType: "Sick Leave", startDate: "2024-06-11", endDate: "2024-06-13", days: 3, status: "Approved", reason: "Flu recovery" },
  { id: "6", date: "2024-06-10", employee: "James Wilson", department: "Sales", leaveType: "Maternity Leave", startDate: "2024-07-15", endDate: "2024-10-15", days: 90, status: "Rejected", reason: "Maternity leave" },
];

export function LeaveManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState(leaveRequests);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "Approved" } : req
    ));
    toast.success("Leave request approved");
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "Rejected" } : req
    ));
    toast.success("Leave request rejected");
  };

  const handleViewRequest = (requestId: string) => {
    toast.info("Opening request details...");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return <Badge variant="outline">{status}</Badge>;
      case "Approved": return <Badge variant="secondary">{status}</Badge>;
      case "Rejected": return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case "Annual Leave": return <Badge variant="default">{type}</Badge>;
      case "Sick Leave": return <Badge variant="secondary">{type}</Badge>;
      case "Personal Leave": return <Badge variant="outline">{type}</Badge>;
      case "Maternity Leave": return <Badge className="bg-purple-100 text-purple-800">{type}</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Filter options for leave requests
  const leaveFilterOptions: FilterOption[] = [
    {
      key: "department",
      label: "Department",
      type: "multiselect",
      options: [
        { value: "Engineering", label: "Engineering" },
        { value: "Sales", label: "Sales" },
        { value: "Marketing", label: "Marketing" },
        { value: "Operations", label: "Operations" },
        { value: "HR", label: "HR" },
        { value: "Finance", label: "Finance" }
      ]
    },
    {
      key: "leaveType",
      label: "Leave Type",
      type: "multiselect",
      options: [
        { value: "Annual Leave", label: "Annual Leave" },
        { value: "Sick Leave", label: "Sick Leave" },
        { value: "Personal Leave", label: "Personal Leave" },
        { value: "Maternity Leave", label: "Maternity Leave" }
      ]
    },
    {
      key: "minDays",
      label: "Min Days",
      type: "number",
      placeholder: "e.g. 3"
    },
    {
      key: "maxDays",
      label: "Max Days", 
      type: "number",
      placeholder: "e.g. 30"
    }
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || request.status.toLowerCase() === activeTab;
    
    // Advanced filter matching
    if (filterValues.department && Array.isArray(filterValues.department) && 
        filterValues.department.length > 0 && !filterValues.department.includes(request.department)) {
      return false;
    }
    
    if (filterValues.leaveType && Array.isArray(filterValues.leaveType) && 
        filterValues.leaveType.length > 0 && !filterValues.leaveType.includes(request.leaveType)) {
      return false;
    }
    
    if (filterValues.minDays && request.days < (filterValues.minDays as number)) {
      return false;
    }
    
    if (filterValues.maxDays && request.days > (filterValues.maxDays as number)) {
      return false;
    }
    
    return matchesSearch && matchesTab;
  });

  const getTabCount = (status: string) => {
    if (status === "all") return requests.length;
    return requests.filter(req => req.status.toLowerCase() === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-semibold">{leaveRequests.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold">{getTabCount("pending")}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-semibold">{getTabCount("approved")}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-semibold">{getTabCount("rejected")}</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All ({getTabCount("all")})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({getTabCount("pending")})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({getTabCount("approved")})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({getTabCount("rejected")})</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <AdvancedFilter
                filterOptions={leaveFilterOptions}
                values={filterValues}
                onChange={setFilterValues}
                onReset={() => setFilterValues({})}
              />
            </div>
          </div>

          <TabsContent value={activeTab}>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.employee}</div>
                          <div className="text-sm text-muted-foreground">{request.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                      <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{request.days}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewRequest(request.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {request.status === "Pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleApproveRequest(request.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRejectRequest(request.id)}>
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
          </TabsContent>
        </Tabs>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No leave requests found matching your criteria.
          </div>
        )}
      </Card>
    </div>
  );
}