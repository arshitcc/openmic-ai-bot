"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { User, Search, Phone, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { formatDate } from "@/utils/date";
import Link from "next/link";

function Patients() {
  const { patients, setPatients, isLoadingPatients, setIsLoadingPatients } =
    useAppStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    try {
      const data = await apiClient.getPatients();
      setPatients(data.patients);
    } catch (error) {
      toast.error("Failed to fetch patients");
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      searchTerm === "" ||
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.medicalId.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchTerm)
    );
  });

  if (isLoadingPatients) {
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
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-gray-600">
              Manage patient records and information
            </p>
          </div>
          <Button onClick={fetchPatients} variant="outline">
            Refresh
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search patients by name, medical ID, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <User className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No patients found</h3>
              <p className="text-gray-600">
                {patients.length === 0
                  ? "No patients in the system yet"
                  : "No patients match your search"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Link href={`/patients/${patient.medicalId}`} key={patient.medicalId as string}>
                <Card
                  className="hover:shadow-lg transition-shadow hover:bg-blue-50/30"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">
                            {patient.firstName} {patient.lastName}
                          </CardTitle>
                          <CardDescription className="font-mono">
                            {patient.medicalId}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{patient.email}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          DOB:{" "}
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>

                      {patient.lastVisit && (
                        <div className="text-sm text-gray-500">
                          Last visit: {formatDate(patient.lastVisit)}
                        </div>
                      )}

                      {patient.medicalHistory.allergies.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium text-red-600">
                            Allergies:{" "}
                          </span>
                          <span className="text-gray-600">
                            {patient.medicalHistory.allergies.join(", ")}
                          </span>
                        </div>
                      )}

                      {patient.medicalHistory.conditions.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Conditions: </span>
                          <span className="text-gray-600">
                            {patient.medicalHistory.conditions
                              .slice(0, 2)
                              .join(", ")}
                            {patient.medicalHistory.conditions.length > 2 &&
                              "..."}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Insurance: {patient.insurance.provider}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;
