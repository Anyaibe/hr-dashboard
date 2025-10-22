import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Search, Plus, Eye, MapPin, Globe, MoreHorizontal, Edit, Trash2, PauseCircle, PlayCircle, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { PostJobForm } from "./post-job-form";
import { JobDetailsModal } from "./job-details-modal";
import { InterviewScheduler } from "./interview-scheduler";
import { AdvancedFilter, FilterOption, FilterValues } from "../ui/advanced-filter";

const jobsData = [
  { id: "1", title: "Sr. UX Designer", department: "Design", location: "Remote", experience: "3+ years", applications: 45, status: "Active", postedDate: "5 days ago" },
  { id: "2", title: "Growth Manager", department: "Marketing", location: "New York", experience: "5+ years", applications: 38, status: "Active", postedDate: "3 days ago" },
  { id: "3", title: "Frontend Developer", department: "Engineering", location: "San Francisco", experience: "2+ years", applications: 62, status: "Active", postedDate: "1 week ago" },
  { id: "4", title: "Product Manager", department: "Product", location: "Remote", experience: "4+ years", applications: 28, status: "Draft", postedDate: "Draft" },
];

const candidatesData = [
  { id: "1", name: "Aisha Doe", role: "Sr. UX Designer", applied: "13/01", status: "Shortlisted", rating: 4, stage: "Application Review" },
  { id: "2", name: "Chukwuemeka", role: "Sr. UX Designer", applied: "13/01", status: "Interview", rating: 4, stage: "Technical Interview" },
  { id: "3", name: "Suleman", role: "Sr. UX Designer", applied: "13/01", status: "Pending", rating: 4, stage: "Initial Screening" },
  { id: "4", name: "John Smith", role: "Frontend Developer", applied: "14/01", status: "Rejected", rating: 2, stage: "Application Review" },
  { id: "5", name: "Jane Wilson", role: "Growth Manager", applied: "12/01", status: "Hired", rating: 5, stage: "Onboarding" },
];

interface RecruitmentDashboardProps {
  onCandidateSelect: (candidateId: string) => void;
}

export function RecruitmentDashboard({ onCandidateSelect }: RecruitmentDashboardProps) {
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState(jobsData);
  const [candidates, setCandidates] = useState(candidatesData);
  const [showPostJobForm, setShowPostJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobsData[0] | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState<{id: string, name: string} | null>(null);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const handleJobAction = (jobId: string, action: string) => {
    const job = jobs.find(j => j.id === jobId);
    
    switch (action) {
      case "edit":
        if (job) {
          setSelectedJob(job);
          setShowPostJobForm(true);
        }
        break;
      case "pause":
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: "Draft" } : job
        ));
        toast.success("Job posting paused");
        break;
      case "activate":
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: "Active" } : job
        ));
        toast.success("Job posting activated");
        break;
      case "close":
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: "Closed" } : job
        ));
        toast.success("Job posting closed");
        break;
      case "view":
        if (job) {
          setSelectedJob(job);
          setShowJobDetails(true);
        }
        break;
    }
  };

  const handleCandidateAction = (candidateId: string, action: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    
    switch (action) {
      case "shortlist":
        setCandidates(prev => prev.map(candidate => 
          candidate.id === candidateId ? { ...candidate, status: "Shortlisted" } : candidate
        ));
        toast.success("Candidate shortlisted");
        break;
      case "interview":
        if (candidate) {
          setSelectedCandidateForInterview({ id: candidateId, name: candidate.name });
          setShowInterviewScheduler(true);
        }
        break;
      case "reject":
        setCandidates(prev => prev.map(candidate => 
          candidate.id === candidateId ? { ...candidate, status: "Rejected" } : candidate
        ));
        toast.success("Candidate rejected");
        break;
      case "hire":
        setCandidates(prev => prev.map(candidate => 
          candidate.id === candidateId ? { ...candidate, status: "Hired" } : candidate
        ));
        toast.success("Candidate hired!");
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <Badge variant="secondary">{status}</Badge>;
      case "Draft": return <Badge variant="outline">{status}</Badge>;
      case "Closed": return <Badge variant="destructive">{status}</Badge>;
      case "Shortlisted": return <Badge variant="secondary">{status}</Badge>;
      case "Interview": return <Badge variant="default">{status}</Badge>;
      case "Pending": return <Badge variant="outline">{status}</Badge>;
      case "Rejected": return <Badge variant="destructive">{status}</Badge>;
      case "Hired": return <Badge variant="secondary" className="bg-green-100 text-green-800">{status}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Filter options for jobs
  const jobFilterOptions: FilterOption[] = [
    {
      key: "department",
      label: "Department",
      type: "multiselect",
      options: [
        { value: "Engineering", label: "Engineering" },
        { value: "Design", label: "Design" },
        { value: "Product", label: "Product" },
        { value: "Marketing", label: "Marketing" },
        { value: "Sales", label: "Sales" }
      ]
    },
    {
      key: "location",
      label: "Location",
      type: "multiselect",
      options: [
        { value: "Remote", label: "Remote" },
        { value: "New York", label: "New York" },
        { value: "San Francisco", label: "San Francisco" },
        { value: "London", label: "London" }
      ]
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Draft", label: "Draft" },
        { value: "Closed", label: "Closed" }
      ]
    },
    {
      key: "minApplications",
      label: "Min Applications",
      type: "number",
      placeholder: "e.g. 10"
    }
  ];

  // Filter options for candidates
  const candidateFilterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      type: "multiselect",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Shortlisted", label: "Shortlisted" },
        { value: "Interview", label: "Interview" },
        { value: "Hired", label: "Hired" },
        { value: "Rejected", label: "Rejected" }
      ]
    },
    {
      key: "role",
      label: "Applied Role",
      type: "multiselect",
      options: [
        { value: "Sr. UX Designer", label: "Sr. UX Designer" },
        { value: "Frontend Developer", label: "Frontend Developer" },
        { value: "Growth Manager", label: "Growth Manager" }
      ]
    },
    {
      key: "minRating",
      label: "Min Rating",
      type: "number",
      placeholder: "1-5"
    }
  ];

  // Apply filters
  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.department.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterValues.department && Array.isArray(filterValues.department) && 
        filterValues.department.length > 0 && !filterValues.department.includes(job.department)) {
      return false;
    }
    
    if (filterValues.location && Array.isArray(filterValues.location) && 
        filterValues.location.length > 0 && !filterValues.location.includes(job.location)) {
      return false;
    }
    
    if (filterValues.status && filterValues.status !== job.status) {
      return false;
    }
    
    if (filterValues.minApplications && job.applications < (filterValues.minApplications as number)) {
      return false;
    }
    
    return true;
  });

  const filteredCandidates = candidates.filter(candidate => {
    if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !candidate.role.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterValues.status && Array.isArray(filterValues.status) && 
        filterValues.status.length > 0 && !filterValues.status.includes(candidate.status)) {
      return false;
    }
    
    if (filterValues.role && Array.isArray(filterValues.role) && 
        filterValues.role.length > 0 && !filterValues.role.includes(candidate.role)) {
      return false;
    }
    
    if (filterValues.minRating && candidate.rating < (filterValues.minRating as number)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Open Positions</p>
            <p className="text-2xl font-semibold">6</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="text-2xl font-semibold">173</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">In Interview</p>
            <p className="text-2xl font-semibold">24</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Hired This Month</p>
            <p className="text-2xl font-semibold">5</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <AdvancedFilter
                filterOptions={activeTab === "jobs" ? jobFilterOptions : candidateFilterOptions}
                values={filterValues}
                onChange={setFilterValues}
                onReset={() => setFilterValues({})}
              />
              
              {activeTab === "jobs" && (
                <Button onClick={() => setShowPostJobForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Job
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="jobs">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {job.location === "Remote" ? (
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          )}
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{job.experience}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.applications}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{job.postedDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleJobAction(job.id, "view")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleJobAction(job.id, "edit")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Job
                            </DropdownMenuItem>
                            {job.status === "Active" ? (
                              <DropdownMenuItem onClick={() => handleJobAction(job.id, "pause")}>
                                <PauseCircle className="mr-2 h-4 w-4" />
                                Pause Posting
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleJobAction(job.id, "activate")}>
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleJobAction(job.id, "close")}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Close Job
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

          <TabsContent value="candidates">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>Applied Role</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Resume Rating</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.role}</TableCell>
                      <TableCell>{candidate.applied}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">{renderStars(candidate.rating)}</span>
                          <span className="text-sm text-muted-foreground">{candidate.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.stage}</TableCell>
                      <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onCandidateSelect(candidate.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            {candidate.status === "Pending" && (
                              <DropdownMenuItem onClick={() => handleCandidateAction(candidate.id, "shortlist")}>
                                <Eye className="mr-2 h-4 w-4" />
                                Shortlist
                              </DropdownMenuItem>
                            )}
                            {(candidate.status === "Shortlisted" || candidate.status === "Pending") && (
                              <DropdownMenuItem onClick={() => handleCandidateAction(candidate.id, "interview")}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Interview
                              </DropdownMenuItem>
                            )}
                            {candidate.status === "Interview" && (
                              <DropdownMenuItem onClick={() => handleCandidateAction(candidate.id, "hire")}>
                                <Users className="mr-2 h-4 w-4" />
                                Hire Candidate
                              </DropdownMenuItem>
                            )}
                            {candidate.status !== "Rejected" && candidate.status !== "Hired" && (
                              <DropdownMenuItem onClick={() => handleCandidateAction(candidate.id, "reject")}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Reject
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
      </Card>

      {/* Modals */}
      <PostJobForm
        isOpen={showPostJobForm}
        onClose={() => setShowPostJobForm(false)}
        onSuccess={() => {
          // Refresh jobs list
          toast.success("Job posted successfully!");
        }}
      />

      <JobDetailsModal
        isOpen={showJobDetails}
        onClose={() => setShowJobDetails(false)}
        job={selectedJob}
      />

      {selectedCandidateForInterview && (
        <InterviewScheduler
          isOpen={showInterviewScheduler}
          onClose={() => setShowInterviewScheduler(false)}
          candidateId={selectedCandidateForInterview.id}
          candidateName={selectedCandidateForInterview.name}
          onSuccess={() => {
            setCandidates(prev => prev.map(candidate => 
              candidate.id === selectedCandidateForInterview.id 
                ? { ...candidate, status: "Interview", stage: "Technical Interview" } 
                : candidate
            ));
          }}
        />
      )}
    </div>
  );
}