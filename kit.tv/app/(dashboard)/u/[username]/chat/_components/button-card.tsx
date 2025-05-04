"use client";

import { Button } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteButtonAction } from "./actions";
import { toast } from "sonner";

interface ButtonCardProps {
  button: Button;
}

export const ButtonCard = ({ button }: ButtonCardProps) => {
  const handleDelete = async () => {
    const result = await deleteButtonAction(button);
    if (result.success) {
      toast.success("Button deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete button");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: `#${button.color.toString(16).padStart(6, "0")}` }}
          />
          {button.text}
        </CardTitle>
        <ShadcnButton
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </ShadcnButton>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{button.instructions}</p>
      </CardContent>
    </Card>
  );
}; 