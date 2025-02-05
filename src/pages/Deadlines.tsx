
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Deadlines() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample deadlines data (replace with actual data from Supabase)
  const deadlines = [
    {
      id: 1,
      type: "Document Submission",
      description: "Submit additional documentation for claim CLM123",
      dueDate: "2024-03-20",
      priority: "high",
      assignedTo: "John Doe",
      claimant: "Sarah Smith",
      employer: "Tech Corp",
      status: "pending",
    },
    // Add more sample deadlines
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold text-blue-600">Deadlines</h1>
          
          <div className="flex justify-between items-center">
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search deadlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              Add Deadline
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <Card key={deadline.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{deadline.type}</h3>
                    <p className="text-sm text-gray-600">{deadline.description}</p>
                  </div>
                  <Badge className={getPriorityColor(deadline.priority)}>
                    {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)} Priority
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Due Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {deadline.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Assigned To</p>
                    <p className="font-medium">{deadline.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Claimant</p>
                    <p className="font-medium">{deadline.claimant}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Employer</p>
                    <p className="font-medium">{deadline.employer}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          Powered by Sails Software
        </div>
      </div>
    </DashboardLayout>
  );
}
