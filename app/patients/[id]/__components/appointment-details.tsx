import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IAppointment } from "@/models/appointment.model";
import { IBot } from "@/models/bot.model";
import { ActivityIcon, PhoneCallIcon, PhoneIcon } from "lucide-react";
import React from "react";

type Props = {
  appointments: IAppointment[];
  bots: IBot[];
  makingCall?: boolean;
  handleMakeCall: (botId: string, appointmentId?: string) => void;
};

function AppointmentCard({
  appointments,
  bots,
  makingCall = false,
  handleMakeCall,
}: Props) {
  const formatDate = (d: IAppointment["date"]) => {
    const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
    try {
      return dt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(d);
    }
  };

  const formatTime = (a: IAppointment) => {
    if (a.time) return a.time;
    const dt =
      typeof a.date === "string" || typeof a.date === "number"
        ? new Date(a.date)
        : a.date;
    try {
      return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "-";
    }
  };

  const statusToBadgeProps = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return { text: "Confirmed", className: "bg-green-100 text-green-800" };
      case "pending":
        return { text: "Pending", className: "bg-yellow-100 text-yellow-800" };
      case "cancelled":
        return { text: "Cancelled", className: "bg-red-100 text-red-800" };
      default:
        return {
          text: status || "Unknown",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="w-5 h-5" />
          Appointments ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <PhoneIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No calls found for this patient</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {appointments.map((appointment) => {
                const badge = statusToBadgeProps(appointment.status);
                return (
                  <div key={appointment._id as string} className="py-4 px-2">
                    <div className="flex items-center gap-4 md:gap-6">
                      {/* Avatar / Patient */}
                      <div className="flex-shrink-0">
                        <Avatar className="w-12 h-12">
                          {/* replace with AvatarImage if you have a url */}
                          <AvatarFallback>
                            {appointment.patientId.firstName
                              ? appointment.patientId.firstName.charAt(0)
                              : "P"}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Main details - responsive: stack on small screens */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold truncate">
                                {appointment.patientId.firstName || "Patient"}
                              </h4>

                              <span className="text-sm text-muted-foreground">
                                {formatDate(appointment.date)} •{" "}
                                {formatTime(appointment)}
                              </span>

                              <span className="ml-2">
                                <Badge
                                  className={`px-2 py-1 text-sm ${badge.className}`}
                                >
                                  {badge.text}
                                </Badge>
                              </span>
                            </div>

                            {appointment.note && (
                              <p className="text-sm text-muted-foreground mt-2 truncate">
                                {appointment.note}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 sm:mt-0 flex items-center gap-2">
                            {bots && bots.length > 0 ? (
                              <div className="flex flex-col sm:flex-row gap-2">
                                {bots.slice(0, 2).map((bot) => (
                                  <Button
                                    key={bot._id as string}
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleMakeCall(
                                        bot._id as string,
                                        appointment._id as string
                                      )
                                    }
                                    disabled={makingCall}
                                    className="justify-start whitespace-nowrap"
                                  >
                                    <PhoneCallIcon className="w-4 h-4 mr-2" />
                                    Call for{" "}
                                    <span className="font-semibold">
                                      {bot.name}
                                    </span>
                                  </Button>
                                ))}

                                {bots.length > 2 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="whitespace-nowrap"
                                    disabled
                                  >
                                    +{bots.length - 2} more
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <Button size="sm" variant="ghost" disabled>
                                No bots
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default AppointmentCard;
