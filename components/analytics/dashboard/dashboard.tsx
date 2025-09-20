"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { PhoneIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react";

interface AnalyticsData {
  totalCalls: number;
  completedCalls: number;
  averageDuration: number;
  totalPatients: number;
  urgentCalls: number;
  successRate: number;
  callsByStatus: Record<string, number>;
  callsByUrgency: Record<string, number>;
  recentActivity: any[];
}

export function AnalyticsDashboard() {
  const { calls, patients } = useAppStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (calls.length > 0 || patients.length > 0) {
      calculateAnalytics();
    }
  }, [calls, patients]);

  const calculateAnalytics = () => {
    const totalCalls = calls.length;
    const completedCalls = calls.filter(
      (call) => call.status === "completed"
    ).length;
    const totalDuration = calls.reduce((sum, call) => sum + call.duration, 0);
    const averageDuration =
      totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
    const urgentCalls = calls.filter(
      (call) => call.extractedData?.urgencyLevel === "high"
    ).length;
    const successRate =
      totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;

    const callsByStatus = calls.reduce((acc, call) => {
      acc[call.status] = (acc[call.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const callsByUrgency = calls.reduce((acc, call) => {
      const urgency = call.extractedData?.urgencyLevel || "unknown";
      acc[urgency] = (acc[urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = calls
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    setAnalytics({
      totalCalls,
      completedCalls,
      averageDuration,
      totalPatients: patients.length,
      urgentCalls,
      successRate,
      callsByStatus,
      callsByUrgency,
      recentActivity,
    });
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div> */}
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Monitor your AI agent performance and call metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedCalls} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Call completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(analytics.averageDuration / 60)}:
              {(analytics.averageDuration % 60).toString().padStart(2, "0")}
            </div>
            <p className="text-xs text-muted-foreground">Minutes per call</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Calls</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {analytics.urgentCalls}
            </div>
            <p className="text-xs text-muted-foreground">High priority cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.callsByStatus).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{status}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / analytics.totalCalls) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Urgency Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.callsByUrgency).map(
                ([urgency, count]) => (
                  <div
                    key={urgency}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{urgency}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            urgency === "high"
                              ? "bg-red-500"
                              : urgency === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(count / analytics.totalCalls) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Call Activity</CardTitle>
          <CardDescription>
            Latest 5 calls processed by your AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {analytics.recentActivity.map((call) => (
                <div
                  key={call._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{call.callId}</div>
                    <div className="text-sm text-gray-600">
                      {call.phoneNumber} •{" "}
                      {call.extractedData?.patientName || "Unknown patient"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        call.status === "completed"
                          ? "text-green-600"
                          : call.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {call.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(call.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
