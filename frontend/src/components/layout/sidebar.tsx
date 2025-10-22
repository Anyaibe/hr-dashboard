import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  Clock, 
  FolderKanban,
  Settings,
  Search
} from "lucide-react";
import { Input } from "../ui/input";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "Employees", icon: Users },
  { id: "remuneration", label: "Remuneration", icon: DollarSign },
  { id: "recruitment", label: "Recruitment", icon: Briefcase },
  { id: "leave", label: "Leave Management", icon: Calendar },
  { id: "attendance", label: "Attendance", icon: Clock },
  { id: "workplace", label: "Work Management", icon: FolderKanban },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="font-semibold">HR Dashboard</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" />
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onViewChange("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
        </div>
      </div>
    </div>
  );
}