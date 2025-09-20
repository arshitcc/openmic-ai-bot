"use client";

import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientProfile } from "./__components/patient-profile";
import { useParams } from "next/navigation";

function PatientProfileSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PatientProfilePage() {
  const params = useParams();
  const { id } = params;
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<PatientProfileSkeleton />}>
        <PatientProfile patientId={id as string} />
      </Suspense>
    </div>
  );
}

export default PatientProfilePage;
