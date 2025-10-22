import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Clock, MapPin, Wifi, Building, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const attendanceRecords = [
  { id: "1", employee: "Sarah Johnson", date: "2024-06-15", checkIn: "09:00", checkOut: "17:30", workType: "Office", status: "Present", totalHours: "8.5", location: "New York Office" },
  { id: "2", employee: "Michael Chen", date: "2024-06-15", checkIn: "09:15", checkOut: "18:00", workType: "Remote", status: "Present", totalHours: "8.75", location: "Home" },
  { id: "3", employee: "Emily Rodriguez", date: "2024-06-15", checkIn: "08:45", checkOut: "17:15", workType: "Office", status: "Present", totalHours: "8.5", location: "San Francisco Office" },
  { id: "4", employee: "David Thompson", date: "2024-06-14", checkIn: "10:30", checkOut: "17:30", workType: "Hybrid", status: "Late", totalHours: "7", location: "New York Office" },
  { id: "5", employee: "Lisa Wang", date: "2024-06-14", checkIn: "-", checkOut: "-", workType: "-", status: "Absent", totalHours: "0", location: "-" },
];

const todayAttendance = [
  { employee: "Sarah Johnson", status: "checked-in", checkIn: "09:00", workType: "Office" },
  { employee: "Michael Chen", status: "checked-in", checkIn: "09:15", workType: "Remote" },
  { employee: "Emily Rodriguez", status: "checked-out", checkIn: "08:45", checkOut: "17:15", workType: "Office" },
  { employee: "David Thompson", status: "not-checked-in", checkIn: "-", workType: "-" },
];

export function AttendanceTracking() {
  const [checkInData, setCheckInData] = useState({
    workType: "",
    location: "",
    notes: ""
  });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update time every second
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  });

  const handleCheckIn = () => {
    if (!checkInData.workType || !checkInData.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsCheckedIn(true);
    toast.success("Successfully checked in!");
    setCheckInData({ workType: "", location: "", notes: "" });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    toast.success("Successfully checked out!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present": return <Badge variant="secondary" className="bg-green-100 text-green-800">{status}</Badge>;
      case "Late": return <Badge variant="outline" className="border-yellow-500 text-yellow-700">{status}</Badge>;
      case "Absent": return <Badge variant="destructive">{status}</Badge>;
      case "checked-in": return <Badge variant="secondary" className="bg-green-100 text-green-800">Checked In</Badge>;
      case "checked-out": return <Badge variant="outline">Checked Out</Badge>;
      case "not-checked-in": return <Badge variant="destructive">Not Checked In</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getWorkTypeIcon = (workType: string) => {
    switch (workType) {
      case "Office": return <Building className="h-4 w-4" />;
      case "Remote": return <Wifi className="h-4 w-4" />;
      case "Hybrid": return <MapPin className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Present Today</p>
              <p className="text-2xl font-semibold">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Late Arrivals</p>
              <p className="text-2xl font-semibold">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-2xl font-semibold">2</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Wifi className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Remote Workers</p>
              <p className="text-2xl font-semibold">8</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check In/Out Form */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracking
          </h3>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current Time</p>
              <p className="text-xl font-semibold">{currentTime}</p>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>

            {!isCheckedIn ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workType">Work Type *</Label>
                  <Select value={checkInData.workType} onValueChange={(value) => setCheckInData({...checkInData, workType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={checkInData.location}
                    onChange={(e) => setCheckInData({...checkInData, location: e.target.value})}
                    placeholder="Enter your location"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={checkInData.notes}
                    onChange={(e) => setCheckInData({...checkInData, notes: e.target.value})}
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleCheckIn} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Checked In</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Started work at 09:00 AM</p>
                </div>

                <Button onClick={handleCheckOut} variant="outline" className="w-full">
                  <XCircle className="mr-2 h-4 w-4" />
                  Check Out
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Today's Summary */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="mb-4">Today's Attendance</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayAttendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.employee}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getWorkTypeIcon(record.workType)}
                        {record.workType}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card className="p-6">
        <h3 className="mb-4">Attendance Records</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employee}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>{record.totalHours}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getWorkTypeIcon(record.workType)}
                      {record.workType}
                    </div>
                  </TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}