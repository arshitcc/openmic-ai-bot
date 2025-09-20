"use client";

import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BotFormData, BotFormSchema } from "@/lib/schemas";
import { IBot } from "@/models/bot.model";
import { medicalBotPrompt } from "@/utils/prompt";

interface BotFormProps {
  bot?: IBot;
  onSubmit: (data: BotFormData) => Promise<void>;
  onCancel: () => void;
}

export function BotForm({ bot, onSubmit, onCancel }: BotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BotFormData>({
    resolver: zodResolver(BotFormSchema) as Resolver<BotFormData>,
    defaultValues: {
      name: bot?.name || "",
      description: bot?.description || "",
      prompt: bot?.prompt || medicalBotPrompt,
      domain: bot?.domain || "medical",
      settings: {
        voice: bot?.settings?.voice || "alloy",
        language: bot?.settings?.language || "en",
        maxCallDuration: bot?.settings?.maxCallDuration || 600,
      },
    },
  });

  const handleFormSubmit = async (data: BotFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        bot ? "Bot updated successfully" : "Bot created successfully"
      );
      reset();
    } catch (error) {
      toast.error("Failed to save bot");
      console.error("Error saving bot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Bot Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Medical Intake Assistant"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <select
            id="domain"
            {...register("domain")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="medical">Medical</option>
            <option value="legal">Legal</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register("description")}
          placeholder="AI assistant for medical patient intake"
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Bot Prompt</Label>
        <Textarea
          id="prompt"
          {...register("prompt")}
          className="h-50 md:h-70 max-h-50 md:max-h-70"
          rows={8}
          placeholder="Enter the bot's system prompt..."
        />
        {errors.prompt && (
          <p className="text-sm text-red-600">{errors.prompt.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voice">Voice</Label>
          <select
            id="voice"
            {...register("settings.voice")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="alloy">Alloy</option>
            <option value="echo">Echo</option>
            <option value="fable">Fable</option>
            <option value="onyx">Onyx</option>
            <option value="nova">Nova</option>
            <option value="shimmer">Shimmer</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            {...register("settings.language")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCallDuration">Max Duration (seconds)</Label>
          <Input
            id="maxCallDuration"
            type="number"
            {...register("settings.maxCallDuration", {
              valueAsNumber: true,
            })}
            min={60}
            max={1800}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : bot ? "Update Bot" : "Create Bot"}
        </Button>
      </div>
    </form>
  );
}
