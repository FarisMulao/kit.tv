"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createButtonAction, getSoundsAction } from "./actions";
import { useEffect, useState } from "react";
import { Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { Sound } from "@prisma/client";

interface CreateButtonDialogProps {
  streamerId: string;
}

export const CreateButtonDialog = ({ streamerId }: CreateButtonDialogProps) => {
  const [text, setText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [color, setColor] = useState("#000000");
  const [soundName, setSoundName] = useState<string | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ text?: string; instructions?: string }>({});

  useEffect(() => {
    const loadSounds = async () => {
      const result = await getSoundsAction();
      if (result.success && result.sounds) {
        setSounds(result.sounds);
      }
    };
    loadSounds();
  }, []);

  const validateForm = () => {
    const newErrors: { text?: string; instructions?: string } = {};
    if (!text.trim()) {
      newErrors.text = "Button text is required";
    }
    if (!instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createButtonAction({
        id: "",
        text,
        font: "Arial",
        size: 16,
        color: parseInt(color.replace("#", "0x"), 16),
        instructions,
        credits: "",
        timeout: 100,
        streamerId,
        soundName,
      });
      setOpen(false);
      // Reset form
      setText("");
      setInstructions("");
      setColor("#000000");
      setSoundName(null);
      setErrors({});
    } catch (error) {
      console.error("Failed to create button:", error);
    }
  };

  const playSound = (soundName: string) => {
    const audio = new Audio(`/audioClips/${soundName}.mp3`);
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
      toast.error("Failed to play sound");
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" data-cy="create-button-button">
          <Plus className="h-4 w-4 mr-2" />
          Add Button
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-cy="create-button-dialog-title">Create New Button</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text" data-cy="create-button-dialog-text">Button Text *</Label>
            <Input
              id="text"
              data-cy="create-button-dialog-text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter button text"
              required
            />
            {errors.text && (
              <p className="text-sm text-destructive">{errors.text}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions" data-cy="create-button-dialog-instructions">Instructions *</Label>
            <Input
              id="instructions"
              data-cy="create-button-dialog-instructions-input"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter button instructions"
              required
            />
            {errors.instructions && (
              <p className="text-sm text-destructive">{errors.instructions}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="color" data-cy="create-button-dialog-color">Button Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 p-1"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sound" data-cy="create-button-dialog-sound">Sound Effect</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={soundName || ""}
                  onValueChange={(value) => setSoundName(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None ">None</SelectItem>
                    {sounds.map((sound) => (
                      <SelectItem key={sound.id} value={sound.fileName}>
                        {sound.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {soundName && soundName !== "None " && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playSound(soundName)}
                  className="h-10 w-10"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} data-cy="create-button-dialog-button">Create Button</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 