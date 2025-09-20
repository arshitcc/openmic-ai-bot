"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  MapPinIcon,
  HeartIcon,
  AlertTriangleIcon,
  PillIcon,
  ShieldIcon,
  UserIcon,
  ActivityIcon,
  PhoneCallIcon,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { CallDetailsAccordion } from "./call-details";
import { Appointment } from "@/models/appointment.model";
import AppointmentCard from "./appointment-details";

interface PatientProfileProps {
  patientId: string;
}

export function PatientProfile({ patientId }: PatientProfileProps) {
  const [patient, setPatient] = useState<any>(null);
  const [calls, setCalls] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [makingCall, setMakingCall] = useState(false);
  const { bots } = useAppStore();

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const [patientResponse, callsResponse, appointmentsResponse] =
        await Promise.all([
          apiClient.getPatient(patientId),
          apiClient.getCalls({ patientId }),
          apiClient.getAppointments(patientId),
        ]);

      setPatient(patientResponse.patient);
      setCalls(callsResponse.calls);
      setAppointments(appointmentsResponse.appointments);
    } catch (error) {
      console.error("Error loading patient data:", error);
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeCall = async (botId: string) => {
    if (!patient?.phone) {
      toast.error("Patient phone number not available");
      return;
    }

    try {
      setMakingCall(true);
      await apiClient.initiateCall(patient._id, {
        botId,
        toNumber: patient.phoneNumber,
        patientId: patient.medicalId,
        customData: {
          patientName: `${patient.firstName} ${patient.lastName}`,
          medicalId: patient.medicalId,
        },
      });

      toast.success("Call initiated successfully");

      setTimeout(() => {
        loadPatientData();
      }, 2000);
    } catch (error) {
      console.error("Error making call:", error);
      toast.error("Failed to initiate call");
    } finally {
      setMakingCall(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "in-progress":
        return "default";
      case "failed":
        return "destructive";
      case "ended":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side - Patient Details Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="text-center pb-4">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl">
                  {patient.firstName?.[0]}
                  {patient.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">
                {patient.firstName} {patient.lastName}
              </CardTitle>
              <p className="text-muted-foreground">
                Medical ID: {patient.medicalId}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>
                      DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{Object.values(patient.address).join(", ")}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Medical Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <HeartIcon className="w-4 h-4" />
                  Medical Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Allergies
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.allergies?.map(
                        (allergy: string, index: number) => (
                          <Badge
                            key={index}
                            variant="destructive"
                            className="text-xs"
                          >
                            <AlertTriangleIcon className="w-3 h-3 mr-1" />
                            {allergy}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Medications
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medications?.map(
                        (medication: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            <PillIcon className="w-3 h-3 mr-1" />
                            {medication}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Medical Conditions
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medicalConditions?.map(
                        (condition: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {condition}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Insurance Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4" />
                  Insurance
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span>{patient.insurance?.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Policy:</span>
                    <span>{patient.insurance?.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Group:</span>
                    <span>{patient.insurance?.groupNumber}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Call Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="w-5 h-5" />
                Call History ({calls.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PhoneIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No calls found for this patient</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <CallDetailsAccordion calls={calls} />
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          <AppointmentCard
            appointments={appointments}
            bots={bots}
            makingCall={makingCall}
            handleMakeCall={handleMakeCall}
          />
        </div>
      </div>
    </div>
  );
}
