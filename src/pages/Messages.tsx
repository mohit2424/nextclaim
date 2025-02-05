
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample messages data (replace with actual data from Supabase)
  const messages = [
    {
      id: 1,
      subject: "Claim Update Required",
      sender: "John Smith",
      preview: "Please review the updated documentation for claim CLM123...",
      date: "2024-03-15",
      unread: true,
    },
    // Add more sample messages
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold text-blue-600">Messages</h1>
          
          <div className="flex justify-between items-center">
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              New Message
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{message.subject}</h3>
                    {message.unread && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">From: {message.sender}</p>
                  <p className="text-sm text-gray-600">{message.preview}</p>
                </div>
                <span className="text-sm text-gray-500">{message.date}</span>
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
