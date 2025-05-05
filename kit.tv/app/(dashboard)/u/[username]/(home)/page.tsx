import { StreamPlayer } from "@/components/stream-player";
import { EventsPanel } from "@/app/(dashboard)/u/[username]/(home)/_components/events-panel";
import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const externalUser = await currentUser();
  const { username: usernameParams } = await params;
  const user = await getUserByUsername(usernameParams);

  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full flex">
      <div className="flex-1">
        <StreamPlayer user={user} stream={user.stream} isFollowing={true} />
      </div>
      <EventsPanel userId={user.id} />
    </div>
  );
};

export default CreatorPage;
