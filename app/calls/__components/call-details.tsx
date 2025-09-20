import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICall } from "@/models/call.model";

function CallDetails({ call }: { call: ICall }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Call ID
              </label>
              <p className="font-mono">{call.callId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-1">
                {call.status === "completed" && (
                  <Badge variant="success">Completed</Badge>
                )}
                {call.status === "in-progress" && (
                  <Badge variant="warning">In Progress</Badge>
                )}
                {call.status === "failed" && (
                  <Badge variant="destructive">Failed</Badge>
                )}
                {call.status === "initiated" && (
                  <Badge variant="secondary">Initiated</Badge>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <p>{call.phoneNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Duration
              </label>
              <p>
                {call.duration > 0
                  ? `${Math.floor(call.duration / 60)}:${(call.duration % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {call.extractedData && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {call.extractedData.patientName && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Patient Name
                  </label>
                  <p>{call.extractedData.patientName}</p>
                </div>
              )}
              {call.extractedData.medicalId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Medical ID
                  </label>
                  <p className="font-mono">{call.extractedData.medicalId}</p>
                </div>
              )}
              {call.extractedData.reasonForCall && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Reason for Call
                  </label>
                  <p>{call.extractedData.reasonForCall}</p>
                </div>
              )}
              {call.extractedData.urgencyLevel && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Urgency Level
                  </label>
                  <div className="mt-1">
                    {call.extractedData.urgencyLevel === "high" && (
                      <Badge variant="destructive">High</Badge>
                    )}
                    {call.extractedData.urgencyLevel === "medium" && (
                      <Badge variant="warning">Medium</Badge>
                    )}
                    {call.extractedData.urgencyLevel === "low" && (
                      <Badge variant="secondary">Low</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {call.transcript && (
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {call.transcript}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {call.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{call.summary}</p>
          </CardContent>
        </Card>
      )}

      {(call.webhookData?.preCallData ||
        call.webhookData?.functionCallData ||
        call.webhookData?.postCallData) && (
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {call.webhookData.preCallData && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Pre-call Data</h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(call.webhookData.preCallData, null, 2)}
                  </pre>
                </div>
              )}

              {call.webhookData.functionCallData && (
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Function Call Data
                  </h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(call.webhookData.functionCallData, null, 2)}
                  </pre>
                </div>
              )}

              {call.webhookData.postCallData && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Post-call Data</h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(call.webhookData.postCallData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CallDetails;
