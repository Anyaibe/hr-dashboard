import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Globe, Calendar, Users, DollarSign, Clock } from "lucide-react";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    experience: string;
    applications: number;
    status: string;
    postedDate: string;
  } | null;
}

export function JobDetailsModal({ isOpen, onClose, job }: JobDetailsModalProps) {
  if (!job) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <Badge variant="secondary">{status}</Badge>;
      case "Draft": return <Badge variant="outline">{status}</Badge>;
      case "Closed": return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const jobDescription = {
    "Sr. UX Designer": "We are looking for a Senior UX Designer to join our growing design team. You will be responsible for creating intuitive and engaging user experiences across our digital products.",
    "Growth Manager": "Join our marketing team as a Growth Manager to drive user acquisition, retention, and revenue growth through data-driven strategies and innovative campaigns.",
    "Frontend Developer": "We're seeking a talented Frontend Developer to build responsive, high-performance web applications using modern technologies and best practices.",
    "Product Manager": "Lead product strategy and development as a Product Manager, working closely with engineering, design, and business teams to deliver exceptional user experiences."
  };

  const requirements = {
    "Sr. UX Designer": [
      "3+ years of UX design experience",
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Strong portfolio demonstrating UX process",
      "Experience with user research and testing",
      "Knowledge of accessibility guidelines"
    ],
    "Growth Manager": [
      "5+ years in growth marketing or related field",
      "Experience with digital marketing channels",
      "Strong analytical and data interpretation skills",
      "Knowledge of A/B testing and optimization",
      "Bachelor's degree in Marketing or related field"
    ],
    "Frontend Developer": [
      "2+ years of frontend development experience",
      "Proficiency in React, TypeScript, and modern CSS",
      "Experience with responsive design principles",
      "Knowledge of web performance optimization",
      "Familiarity with version control (Git)"
    ],
    "Product Manager": [
      "4+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile development methodologies",
      "Excellent communication and leadership skills",
      "Technical background preferred"
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
          <DialogDescription>
            View detailed information about this job posting including requirements, benefits, and application details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 p-6">
          {/* Job Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{job.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {job.location === "Remote" ? (
                  <Globe className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience Required</p>
                  <p className="font-medium">{job.experience}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="font-medium">{job.applications} candidates</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="font-medium">{job.postedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-5 w-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(job.status)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">Compensation</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Competitive salary based on experience, plus comprehensive benefits package including health insurance, 
              retirement plans, and professional development opportunities.
            </p>
          </div>
          
          {/* Job Description */}
          <div className="space-y-3">
            <h4 className="font-medium">Job Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {jobDescription[job.title as keyof typeof jobDescription] || 
               "Join our team and contribute to building innovative solutions that make a difference."}
            </p>
          </div>
          
          {/* Requirements */}
          <div className="space-y-3">
            <h4 className="font-medium">Requirements</h4>
            <ul className="space-y-2">
              {(requirements[job.title as keyof typeof requirements] || []).map((requirement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Benefits */}
          <div className="space-y-3">
            <h4 className="font-medium">What We Offer</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">• Competitive salary and equity</p>
                <p className="text-sm font-medium">• Comprehensive health insurance</p>
                <p className="text-sm font-medium">• Flexible working arrangements</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">• Professional development budget</p>
                <p className="text-sm font-medium">• Modern office and equipment</p>
                <p className="text-sm font-medium">• Collaborative team environment</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">
              Edit Job
            </Button>
            <Button>
              View Applications ({job.applications})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}