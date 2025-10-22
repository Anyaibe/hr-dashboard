import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Mail, Phone, Linkedin, Github, FileText, ExternalLink, X, ArrowRight } from "lucide-react";

interface CandidateProfileProps {
  candidateId: string;
  onClose: () => void;
}

export function CandidateProfile({ candidateId, onClose }: CandidateProfileProps) {
  // Mock candidate data
  const candidate = {
    name: "Aisha Doe",
    role: "Sr. UX Designer",
    email: "aisha.doe@email.com",
    phone: "+1 5423-6548",
    location: "New York, NY",
    appliedDate: "March 20, 2024",
    currentStage: "Interview",
    rating: 4,
    status: "Shortlisted"
  };

  const timeline = [
    { stage: "Shortlisted", date: "March 20, 2024", status: "completed", description: "Application reviewed and shortlisted" },
    { stage: "First Contact", date: "March 22, 2024", status: "completed", description: "Initial phone screening completed" },
    { stage: "Interview", date: "March 25, 2024", status: "in-progress", description: "Technical interview scheduled" },
    { stage: "HR Review", date: "Pending", status: "pending", description: "Awaiting interview completion" },
    { stage: "Hired", date: "Pending", status: "pending", description: "Final decision pending" }
  ];

  const documents = [
    { name: "Resume", type: "PDF", size: "2.4 MB" },
    { name: "Cover Letter", type: "PDF", size: "1.1 MB" },
    { name: "Salary_Slip_June.pdf", type: "PDF", size: "890 KB" }
  ];

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-yellow-500";
      case "pending": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  const getStageNumber = (index: number, status: string) => {
    if (status === "completed") return "✓";
    return index + 1;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Candidate Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidate Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <p className="text-muted-foreground">{candidate.role}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {candidate.phone}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant="secondary">{candidate.status}</Badge>
              <p className="text-sm text-muted-foreground mt-1">Applied: {candidate.appliedDate}</p>
            </div>
          </div>

          <Separator />

          {/* Application Timeline */}
          <div>
            <h4 className="font-medium mb-4">Application Details</h4>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getStageColor(item.status)}`}>
                    {getStageNumber(index, item.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{item.stage}</h5>
                      {item.status === "in-progress" && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                          Under Review
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4">Links</h4>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Linkedin className="mr-2 h-4 w-4 text-blue-600" />
                LinkedIn
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Github className="mr-2 h-4 w-4" />
                GitHub
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Blog
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h4 className="font-medium mb-4">Documents</h4>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm">Move to next stage:</span>
              <Select defaultValue="hr-review">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr-review">HR Review</SelectItem>
                  <SelectItem value="final-interview">Final Interview</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                End Stage
              </Button>
              <Button>
                <ArrowRight className="mr-2 h-4 w-4" />
                Next Stage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}