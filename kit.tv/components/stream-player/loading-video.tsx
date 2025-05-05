import { Loader } from "lucide-react";

interface LoadingVideoProps {
  label: string;
}

export const LoadingVideo = ({ label }: LoadingVideoProps) => {
  return (
    <div className="h-full flex items-center justify-center space-y-4 flex-col">
      <Loader className="h-10 w-10 animate-spin" />
      <p className="text-muted-foreground capitalize">{label}</p>
    </div>
  );
};
