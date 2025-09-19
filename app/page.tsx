import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BotIcon, PhoneIcon, FileTextIcon, ActivityIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            OpenMic AI Medical Intake Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your medical practice with AI-powered patient intake and
            call management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BotIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">AI Agents</CardTitle>
              <CardDescription>
                Manage and configure your medical intake bots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/bots">
                <Button className="w-full">Manage Bots</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <PhoneIcon className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Call Logs</CardTitle>
              <CardDescription>
                View detailed call history and transcripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/calls">
                <Button className="w-full bg-transparent" variant="outline">
                  View Calls
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileTextIcon className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Patient Records</CardTitle>
              <CardDescription>
                Access patient information and medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patients">
                <Button className="w-full bg-transparent" variant="outline">
                  View Patients
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <ActivityIcon className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>
                Monitor performance and call metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/analytics">
                <Button className="w-full bg-transparent" variant="outline">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pre-Call Setup</h3>
              <p className="text-gray-600">
                System fetches patient data and prepares the AI agent with
                relevant medical history
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">During Call</h3>
              <p className="text-gray-600">
                AI agent conducts intake, requests medical ID, and fetches
                real-time patient information
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Post-Call</h3>
              <p className="text-gray-600">
                Call transcript and data are processed, logged, and integrated
                into patient records
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
