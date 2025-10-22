import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CalendarIcon, User, Clock, FileText, MapPin } from "lucide-react";
import { LeaveRequest } from "../../lib/api";

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
}

export function RequestDetailsModal({ isOpen, onClose, request }: RequestDetailsModalProps) {
  if (!request) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline">{status}</Badge>;
      case "approved": return <Badge variant="secondary">{status}</Badge>;
      case "rejected": return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>
            View and manage leave request information for {request.employee_name} {request.employee_last_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Employee</p>
                  <p className="font-medium">{request.employee_name} {request.employee_last_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{request.department_name}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Leave Type</p>
                  <p className="font-medium">{request.leave_type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date Range</p>
                  <p className="font-medium">{request.start_date} - {request.end_date}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">{getStatusBadge(request.status)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Reason</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{request.reason}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Manager Comments</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {request.manager_comments || "No comments yet."}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {request.status === "pending" && (
              <>
                <Button variant="destructive">
                  Reject Request
                </Button>
                <Button>
                  Approve Request
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}