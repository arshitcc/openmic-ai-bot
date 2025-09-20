"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  DollarSign,
  Activity,
} from "lucide-react";

interface CallDetailsAccordionProps {
  calls: any[];
}

export function CallDetailsAccordion({ calls }: CallDetailsAccordionProps) {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "in-progress":
        return <Timer className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {calls.map((call, index) => (
        <AccordionItem
          key={call._id || index}
          value={`call-${index}`}
          className="border rounded-lg"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(call.status)}
                <div className="text-left">
                  <div className="font-medium">
                    {new Date(call.createdAt).toLocaleDateString()} at{" "}
                    {new Date(call.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration:{" "}
                    {call.duration ? formatDuration(call.duration) : "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getUrgencyColor(call.urgency)}>
                  {call.urgency || "Normal"}
                </Badge>
                <Badge variant="outline">{call.status}</Badge>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Call Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">From:</span>
                      <p className="font-medium">{call.fromNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">To:</span>
                      <p className="font-medium">{call.toNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Direction:</span>
                      <p className="font-medium capitalize">{call.direction}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bot Used:</span>
                      <p className="font-medium">
                        {call.botId?.name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {call.summary && (
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Summary:
                      </span>
                      <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                        {call.summary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Extracted Information */}
              {call.extractedInfo &&
                Object.keys(call.extractedInfo).length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Extracted Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(call.extractedInfo).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="font-medium">
                                {String(value)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Call Transcript */}
              {call.transcript && call.transcript.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {call.transcript.map((message: any, idx: number) => (
                        <div
                          key={idx}
                          className={`flex gap-3 ${
                            message[0] === "assistant"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              message[0] === "assistant"
                                ? "bg-muted text-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <div className="font-medium text-xs mb-1 opacity-70">
                              {message[0] === "assistant"
                                ? "AI Agent"
                                : "Patient"}
                            </div>
                            <p>{message[1]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Call Metrics */}
              {call.latency && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Avg Latency</p>
                        <p className="font-bold text-lg">
                          {call.latency.e2e_median_latency}s
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">LLM Response</p>
                        <p className="font-bold text-lg">
                          {call.latency.llm_median_latency}s
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">TTS Speed</p>
                        <p className="font-bold text-lg">
                          {call.latency.tts_median_latency}s
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Call Cost */}
              {call.callCost && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Call Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Total Cost:
                        </span>
                        <p className="font-bold">
                          ${call.callCost.total_cost?.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">LLM Cost:</span>
                        <p className="font-medium">
                          ${call.callCost.llm_cost?.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
