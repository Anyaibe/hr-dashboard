import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AdvancedFilter, FilterOption, FilterValues } from "../ui/advanced-filter";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Users, 
  Target, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  MoreHorizontal,
  User,
  Edit,
  Trash2,
  Archive,
  UserPlus
} from "lucide-react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "sonner";

const projects = [
  { id: "1", name: "Website Redesign", description: "Complete overhaul of company website", progress: 65, tasks: 12, completed: 8, team: 5, deadline: "2024-07-15", status: "In Progress" },
  { id: "2", name: "Mobile App Development", description: "Native mobile application for iOS and Android", progress: 30, tasks: 18, completed: 5, team: 7, deadline: "2024-08-30", status: "In Progress" },
  { id: "3", name: "Database Migration", description: "Migrate legacy database to new infrastructure", progress: 85, tasks: 8, completed: 7, team: 3, deadline: "2024-06-30", status: "Near Completion" },
  { id: "4", name: "Marketing Campaign", description: "Q3 digital marketing campaign launch", progress: 15, tasks: 10, completed: 2, team: 4, deadline: "2024-07-01", status: "Planning" },
];

const tasks = [
  { id: "1", title: "Design homepage mockup", project: "Website Redesign", assignee: "Sarah Johnson", priority: "High", status: "In Progress", deadline: "2024-06-20", description: "Create initial homepage design concepts" },
  { id: "2", title: "Setup CI/CD pipeline", project: "Mobile App Development", assignee: "Michael Chen", priority: "Medium", status: "Pending", deadline: "2024-06-25", description: "Configure automated deployment pipeline" },
  { id: "3", title: "Data backup validation", project: "Database Migration", assignee: "Lisa Wang", priority: "High", status: "Completed", deadline: "2024-06-18", description: "Verify all data backup procedures" },
  { id: "4", title: "Content strategy review", project: "Marketing Campaign", assignee: "Emily Rodriguez", priority: "Low", status: "Pending", deadline: "2024-06-30", description: "Review and approve content strategy document" },
  { id: "5", title: "User testing session", project: "Website Redesign", assignee: "David Thompson", priority: "Medium", status: "Overdue", deadline: "2024-06-15", description: "Conduct user testing for new interface" },
];

const milestones = [
  { id: "1", title: "Design Phase Complete", project: "Website Redesign", date: "2024-06-30", status: "Completed" },
  { id: "2", title: "Development Setup", project: "Mobile App Development", date: "2024-07-15", status: "In Progress" },
  { id: "3", title: "Data Migration Complete", project: "Database Migration", date: "2024-06-25", status: "Pending" },
  { id: "4", title: "Campaign Launch", project: "Marketing Campaign", date: "2024-07-01", status: "Pending" },
];

interface WorkManagementProps {}

export function WorkManagement({}: WorkManagementProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [projectsList, setProjectsList] = useState(projects);
  const [tasksList, setTasksList] = useState(tasks);
  const [milestonesList, setMilestonesList] = useState(milestones);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const handleProjectAction = (projectId: string, action: string) => {
    switch (action) {
      case "view":
        toast.info("Opening project details...");
        break;
      case "edit":
        toast.info("Opening project edit form...");
        break;
      case "add-task":
        toast.info("Opening new task form...");
        break;
      case "archive":
        setProjectsList(prev => prev.map(project => 
          project.id === projectId ? { ...project, status: "Archived" } : project
        ));
        toast.success("Project archived");
        break;
    }
  };

  const handleTaskAction = (taskId: string, action: string) => {
    switch (action) {
      case "update-status":
        setTasksList(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: "Completed" } : task
        ));
        toast.success("Task status updated");
        break;
      case "edit":
        toast.info("Opening task edit form...");
        break;
      case "view":
        toast.info("Opening task details...");
        break;
      case "assign":
        toast.info("Opening assignment dialog...");
        break;
    }
  };

  const handleMilestoneAction = (milestoneId: string, action: string) => {
    switch (action) {
      case "update-status":
        setMilestonesList(prev => prev.map(milestone => 
          milestone.id === milestoneId ? { ...milestone, status: "Completed" } : milestone
        ));
        toast.success("Milestone status updated");
        break;
      case "edit":
        toast.info("Opening milestone edit form...");
        break;
      case "delete":
        setMilestonesList(prev => prev.filter(milestone => milestone.id !== milestoneId));
        toast.success("Milestone deleted");
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return <Badge variant="secondary" className="bg-green-100 text-green-800">{status}</Badge>;
      case "In Progress": return <Badge variant="default">{status}</Badge>;
      case "Pending": return <Badge variant="outline">{status}</Badge>;
      case "Overdue": return <Badge variant="destructive">{status}</Badge>;
      case "Near Completion": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">{status}</Badge>;
      case "Planning": return <Badge variant="outline" className="border-purple-200 text-purple-700">{status}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High": return <Badge variant="destructive">{priority}</Badge>;
      case "Medium": return <Badge variant="outline" className="border-yellow-200 text-yellow-700">{priority}</Badge>;
      case "Low": return <Badge variant="secondary">{priority}</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Filter options for different tabs
  const projectFilterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      type: "multiselect",
      options: [
        { value: "Planning", label: "Planning" },
        { value: "In Progress", label: "In Progress" },
        { value: "Near Completion", label: "Near Completion" },
        { value: "Completed", label: "Completed" }
      ]
    },
    {
      key: "manager",
      label: "Manager",
      type: "multiselect",
      options: [
        { value: "John Smith", label: "John Smith" },
        { value: "Jane Doe", label: "Jane Doe" },
        { value: "Mike Johnson", label: "Mike Johnson" }
      ]
    },
    {
      key: "minProgress",
      label: "Min Progress (%)",
      type: "number",
      placeholder: "0-100"
    }
  ];

  const taskFilterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      type: "multiselect",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
        { value: "Overdue", label: "Overdue" }
      ]
    },
    {
      key: "priority",
      label: "Priority",
      type: "multiselect",
      options: [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" }
      ]
    },
    {
      key: "assignee",
      label: "Assignee",
      type: "multiselect",
      options: [
        { value: "Sarah Johnson", label: "Sarah Johnson" },
        { value: "Michael Chen", label: "Michael Chen" },
        { value: "Emily Rodriguez", label: "Emily Rodriguez" }
      ]
    }
  ];

  const milestoneFilterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      type: "multiselect",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" }
      ]
    },
    {
      key: "project",
      label: "Project",
      type: "multiselect",
      options: [
        { value: "Website Redesign", label: "Website Redesign" },
        { value: "Mobile App Development", label: "Mobile App Development" },
        { value: "Database Migration", label: "Database Migration" },
        { value: "Marketing Campaign", label: "Marketing Campaign" }
      ]
    }
  ];

  const getFilterOptions = () => {
    switch (activeTab) {
      case "projects": return projectFilterOptions;
      case "tasks": return taskFilterOptions;
      case "milestones": return milestoneFilterOptions;
      default: return [];
    }
  };

  // Apply filters to data
  const filteredProjects = projectsList.filter(project => {
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterValues.status && Array.isArray(filterValues.status) && 
        filterValues.status.length > 0 && !filterValues.status.includes(project.status)) {
      return false;
    }
    
    if (filterValues.minProgress && project.progress < (filterValues.minProgress as number)) {
      return false;
    }
    
    return true;
  });

  const filteredTasks = tasksList.filter(task => {
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.project.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.assignee.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterValues.status && Array.isArray(filterValues.status) && 
        filterValues.status.length > 0 && !filterValues.status.includes(task.status)) {
      return false;
    }
    
    if (filterValues.priority && Array.isArray(filterValues.priority) && 
        filterValues.priority.length > 0 && !filterValues.priority.includes(task.priority)) {
      return false;
    }
    
    if (filterValues.assignee && Array.isArray(filterValues.assignee) && 
        filterValues.assignee.length > 0 && !filterValues.assignee.includes(task.assignee)) {
      return false;
    }
    
    return true;
  });

  const filteredMilestones = milestonesList.filter(milestone => {
    if (searchTerm && !milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !milestone.project.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterValues.status && Array.isArray(filterValues.status) && 
        filterValues.status.length > 0 && !filterValues.status.includes(milestone.status)) {
      return false;
    }
    
    if (filterValues.project && Array.isArray(filterValues.project) && 
        filterValues.project.length > 0 && !filterValues.project.includes(milestone.project)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Target className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-semibold">{projects.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
              <p className="text-2xl font-semibold">{tasks.filter(t => t.status === "Completed").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Overdue Tasks</p>
              <p className="text-2xl font-semibold">{tasks.filter(t => t.status === "Overdue").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-2xl font-semibold">19</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
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
                filterOptions={getFilterOptions()}
                values={filterValues}
                onChange={setFilterValues}
                onReset={() => setFilterValues({})}
              />

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {activeTab === "projects" ? "New Project" : activeTab === "tasks" ? "New Task" : "New Milestone"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Create {activeTab === "projects" ? "Project" : activeTab === "tasks" ? "Task" : "Milestone"}
                    </DialogTitle>
                    <DialogDescription>
                      Fill out the form below to create a new {activeTab === "projects" ? "project" : activeTab === "tasks" ? "task" : "milestone"} and assign it to team members.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 p-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter title..." />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter description..." />
                    </div>
                    {activeTab === "tasks" && (
                      <>
                        <div>
                          <Label htmlFor="assignee">Assignee</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sarah">Sarah Johnson</SelectItem>
                              <SelectItem value="michael">Michael Chen</SelectItem>
                              <SelectItem value="emily">Emily Rodriguez</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    <div>
                      <Label>Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? selectedDate.toLocaleDateString() : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="projects">
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{project.name}</h4>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          {project.completed}/{project.tasks} tasks
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.team} members
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleProjectAction(project.id, "view")}>
                          <Target className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProjectAction(project.id, "edit")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProjectAction(project.id, "add-task")}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProjectAction(project.id, "archive")}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{task.project}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {task.assignee}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTaskAction(task.id, "view")}>
                              <Target className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTaskAction(task.id, "edit")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Task
                            </DropdownMenuItem>
                            {task.status !== "Completed" && (
                              <DropdownMenuItem onClick={() => handleTaskAction(task.id, "update-status")}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleTaskAction(task.id, "assign")}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Reassign
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

          <TabsContent value="milestones">
            <div className="space-y-4">
              {filteredMilestones.map((milestone) => (
                <Card key={milestone.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.project}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(milestone.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(milestone.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {milestone.status !== "Completed" && (
                            <DropdownMenuItem onClick={() => handleMilestoneAction(milestone.id, "update-status")}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleMilestoneAction(milestone.id, "edit")}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Milestone
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMilestoneAction(milestone.id, "delete")}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}