import { WifiOff } from "lucide-react";

interface OfflineVideoProps {
  username: string;
}

export const OfflineVideo = ({ username }: OfflineVideoProps) => {
  return (
    <div className="h-full flex items-center justify-center space-y-4 flex-col">
      <WifiOff className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">{username} is offline</p>
    </div>
  );
};
