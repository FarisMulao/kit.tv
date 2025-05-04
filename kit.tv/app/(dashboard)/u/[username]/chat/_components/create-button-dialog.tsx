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
import { createButtonAction } from "./actions";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateButtonDialogProps {
  streamerId: string;
}

export const CreateButtonDialog = ({ streamerId }: CreateButtonDialogProps) => {
  const [text, setText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [color, setColor] = useState("#000000");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ text?: string; instructions?: string }>({});

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
      });
      setOpen(false);
      // Reset form
      setText("");
      setInstructions("");
      setColor("#000000");
      setErrors({});
    } catch (error) {
      console.error("Failed to create button:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Button
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Button</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text">Button Text *</Label>
            <Input
              id="text"
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
            <Label htmlFor="instructions">Instructions *</Label>
            <Input
              id="instructions"
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
            <Label htmlFor="color">Button Color</Label>
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
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Create Button</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 