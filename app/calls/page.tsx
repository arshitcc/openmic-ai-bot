"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import {
  PhoneIcon,
  ClockIcon,
  UserIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { formatDate } from "@/utils/date";
import CallDetails from "./__components/call-details";

function Calls() {
  const {
    calls,
    setCalls,
    isLoadingCalls,
    setIsLoadingCalls,
    selectedCall,
    setSelectedCall,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    setIsLoadingCalls(true);
    try {
      const data = await apiClient.getCalls();
      setCalls(data.calls);
    } catch (error) {
      toast.error("Failed to fetch calls");
      console.error("Error fetching calls:", error);
    } finally {
      setIsLoadingCalls(false);
    }
  };

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      searchTerm === "" ||
      call.callId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phoneNumber.includes(searchTerm) ||
      call.extractedData?.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || call.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "all" ||
      call.extractedData?.urgencyLevel === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in-progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Initiated</Badge>;
    }
  };

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;

    switch (urgency) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="warning">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoadingCalls) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Call Logs</h1>
            <p className="text-gray-600">View and manage call history</p>
          </div>
          <Button onClick={fetchCalls} variant="outline">
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FilterIcon className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search calls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Status</option>
                  <option value="initiated">Initiated</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Urgency</label>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Results</label>
                <div className="text-sm text-gray-600 pt-2">
                  {filteredCalls.length} of {calls.length} calls
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredCalls.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PhoneIcon className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No calls found</h3>
              <p className="text-gray-600">
                {calls.length === 0
                  ? "No calls have been made yet"
                  : "No calls match your filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCalls.map((call) => (
              <Card
                key={call._id as string}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="w-4 h-4 text-blue-600" />
                          <span className="font-mono text-sm">
                            {call.callId}
                          </span>
                        </div>
                        {getStatusBadge(call.status)}
                        {getUrgencyBadge(call.extractedData?.urgencyLevel)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{call.phoneNumber}</span>
                        </div>

                        {call.extractedData?.patientName && (
                          <div className="flex items-center space-x-2">
                            <UserIcon className="w-4 h-4" />
                            <span>{call.extractedData.patientName}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>
                            {call.duration > 0
                              ? formatDuration(call.duration)
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {call.extractedData?.reasonForCall && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Reason: </span>
                          <span className="text-sm text-gray-600">
                            {call.extractedData.reasonForCall}
                          </span>
                        </div>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Call Details - {call.callId}
                          </DialogTitle>
                        </DialogHeader>
                        <CallDetails call={call} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calls;
