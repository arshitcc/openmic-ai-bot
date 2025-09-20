"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { Bot, Edit, Trash2, Plus, Activity } from "lucide-react";
import { toast } from "sonner";
import { IBot } from "@/models/bot.model";
import { apiClient } from "@/lib/api-client";
import { BotForm } from "@/components/forms/bot-form";
import { formatDate } from "@/utils/date";

function Bots() {
  const {
    bots,
    setBots,
    isLoadingBots,
    setIsLoadingBots,
    addBot,
    updateBot,
    removeBot,
  } = useAppStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<IBot | null>(null);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    setIsLoadingBots(true);
    try {
      const data = await apiClient.getBots();
      setBots(data.bots);
    } catch (error) {
      toast.error("Failed to fetch bots");
      console.error("Error fetching bots:", error);
    } finally {
      setIsLoadingBots(false);
    }
  };

  const handleCreateBot = async (data: any) => {
    try {
      const result = await apiClient.createBot(data);
      addBot(result.bot);
      setIsCreateDialogOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateBot = async (data: any) => {
    if (!editingBot) return;

    try {
      const result = await apiClient.updateBot(editingBot._id as string, data);
      updateBot(editingBot._id as string, result.bot);
      setEditingBot(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteBot = async (bot: IBot) => {
    if (!confirm("Are you sure you want to delete this bot?")) return;

    try {
      await apiClient.deleteBot(bot._id as string);
      removeBot(bot._id as string);
      toast.success("Bot deleted successfully");
    } catch (error) {
      toast.error("Failed to delete bot");
      console.error("Error deleting bot:", error);
    }
  };

  if (isLoadingBots) {
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
            <h1 className="text-3xl font-bold">AI Bots</h1>
            <p className="text-gray-600">Manage your OpenMic AI agents</p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>

              <BotForm
                onSubmit={handleCreateBot}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {bots.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bot className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No bots created yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first AI bot to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <Card
                key={bot._id as string}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {bot.domain} • {bot.isActive ? "Active" : "Inactive"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {bot.isActive && (
                        <Activity className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {bot.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div>OpenMic ID: {bot.openMicBotId}</div>
                    <div>Created: {formatDate(bot.createdAt)}</div>
                    <div>Voice: {bot.settings.voice}</div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBot(bot)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBot(bot)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingBot} onOpenChange={() => setEditingBot(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Bot</DialogTitle>
            </DialogHeader>
            {editingBot && (
              <BotForm
                bot={editingBot}
                onSubmit={handleUpdateBot}
                onCancel={() => setEditingBot(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Bots;
