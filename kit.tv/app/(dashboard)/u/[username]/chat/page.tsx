import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";
import { ToggleCard } from "./_components/toggle-card";
import { getButtons } from "@/lib/button-service";
import { Button } from "@prisma/client";
import { CreateButtonDialog } from "./_components/create-button-dialog";
import { ButtonCard } from "./_components/button-card";

const ChatPage = async () => {
  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);
  const buttons = await getButtons(self.id);

  if (!stream) {
    throw new Error("Stream not found");
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Chat Settings</h1>
        <div className="space-y-4">
          <ToggleCard
            field="isChatEnabled"
            label="Enable chat"
            value={stream.isChatEnabled}
          />
          <ToggleCard
            field="isChatDelayed"
            label="Delay chat"
            value={stream.isChatDelayed}
          />
          <ToggleCard
            field="isChatFollowersOnly"
            label="Must be following to chat"
            value={stream.isChatFollowersOnly}
          />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Buttons</h1>
        <div className="space-y-4">
          {buttons.map((button: Button) => (
            <ButtonCard key={button.id} button={button} />
          ))}
          <CreateButtonDialog streamerId={self.id} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
