import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { CalendarIcon, Clock, User, Star } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface InterviewSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  onSuccess: () => void;
}

export function InterviewScheduler({ isOpen, onClose, candidateId, candidateName, onSuccess }: InterviewSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [interviewType, setInterviewType] = useState("technical");
  const [duration, setDuration] = useState("60");
  const [interviewer, setInterviewer] = useState("");
  const [location, setLocation] = useState("video-call");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !interviewer) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Interview scheduled successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to schedule interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview - {candidateName}</DialogTitle>
          <DialogDescription>
            Schedule an interview session by selecting date, time, interviewer, and setting up the meeting details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Interview Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Interview Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interviewType">Interview Type</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screening">Initial Screening</SelectItem>
                    <SelectItem value="technical">Technical Interview</SelectItem>
                    <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                    <SelectItem value="final">Final Interview</SelectItem>
                    <SelectItem value="panel">Panel Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interviewer">Interviewer *</Label>
              <Select value={interviewer} onValueChange={setInterviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">John Smith - Engineering Manager</SelectItem>
                  <SelectItem value="jane-doe">Jane Doe - Senior Developer</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson - Tech Lead</SelectItem>
                  <SelectItem value="sarah-wilson">Sarah Wilson - HR Manager</SelectItem>
                  <SelectItem value="david-brown">David Brown - Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <h4 className="font-medium">Schedule</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Interview Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-medium">Location</h4>
            
            <div className="space-y-2">
              <Label htmlFor="location">Interview Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video-call">Video Call (Zoom/Meet)</SelectItem>
                  <SelectItem value="office">Office - Conference Room A</SelectItem>
                  <SelectItem value="office-b">Office - Conference Room B</SelectItem>
                  <SelectItem value="phone">Phone Interview</SelectItem>
                  <SelectItem value="onsite">Candidate's Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {location === "video-call" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Video call link will be generated and sent to the candidate automatically.
                </p>
              </div>
            )}
          </div>

          {/* Initial Rating */}
          <div className="space-y-4">
            <h4 className="font-medium">Initial Candidate Rating</h4>
            
            <div className="space-y-2">
              <Label>Resume/Application Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`p-1 rounded ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 ? `${rating}/5` : "No rating"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h4 className="font-medium">Additional Notes</h4>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Interview Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific topics to cover, questions to ask, or preparation notes..."
                rows={3}
              />
            </div>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && interviewer && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Interview Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Candidate: {candidateName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{format(selectedDate, "PPPP")} at {selectedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{duration} minutes - {interviewType.replace("-", " ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{location.replace("-", " ")}</Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}