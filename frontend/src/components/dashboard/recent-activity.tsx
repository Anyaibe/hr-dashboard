import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal, Check, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { RequestDetailsModal } from "./request-details-modal";
import { apiService, LeaveRequest, JobApplication } from "../../lib/api";

export function RecentActivity() {  // <-- Make sure it says "export function" not "export default"
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, applicationsRes] = await Promise.all([
          apiService.getLeaveRequests(),
          apiService.getJobApplications()
        ]);
        setRequests(requestsRes.data.slice(0, 4));
        setApplications(applicationsRes.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching activity data:', error);
        toast.error('Failed to load recent activity');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveRequest = async (requestId: number) => {
    try {
      await apiService.approveLeaveRequest(requestId);
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      ));
      toast.success("Request approved successfully");
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await apiService.rejectLeaveRequest(requestId);
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      ));
      toast.success("Request rejected");
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const handleViewRequest = (requestId: number) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowRequestDetails(true);
    }
  };

  const handleDisqualifyCandidate = async (candidateId: number) => {
    try {
      await apiService.rejectApplication(candidateId);
      setApplications(prev => prev.map(app => 
        app.id === candidateId ? { ...app, status: 'rejected' as const } : app
      ));
      toast.success("Candidate disqualified");
    } catch (error) {
      toast.error("Failed to disqualify candidate");
    }
  };

  const handleViewCandidate = (candidateId: number) => {
    toast.info("Opening candidate profile...");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline">{status}</Badge>;
      case "approved": return <Badge variant="secondary">{status}</Badge>;
      case "rejected": return <Badge variant="destructive">{status}</Badge>;
      case "shortlisted": return <Badge variant="secondary">{status}</Badge>;
      case "interview": return <Badge variant="default">{status}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="requests" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Activity</h3>
          <TabsList>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="requests">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.employee_name} {request.employee_last_name}</div>
                        <div className="text-sm text-muted-foreground">{request.department_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.leave_type}</TableCell>
                    <TableCell>{request.start_date} - {request.end_date}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {request.status === "pending" && (
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
                          <DropdownMenuItem onClick={() => handleViewRequest(request.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="applications">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Applied Role</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.candidate_name}</TableCell>
                    <TableCell>{application.job_title}</TableCell>
                    <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCandidate(application.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          {application.status !== "rejected" && (
                            <DropdownMenuItem onClick={() => handleDisqualifyCandidate(application.id)}>
                              <X className="mr-2 h-4 w-4" />
                              Disqualify
                            </DropdownMenuItem>
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
      
      <RequestDetailsModal
        isOpen={showRequestDetails}
        onClose={() => setShowRequestDetails(false)}
        request={selectedRequest}
      />
    </Card>
  );
}