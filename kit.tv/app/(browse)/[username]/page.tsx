import { isFollowingUser } from "@/lib/follow";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const resolvedParams = await params;
  const user = await getUserByUsername(resolvedParams.username);

  if (!user) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);

  if (!user.stream) {
    return <div>No stream available</div>;
  }

  return (
    <StreamPlayer user={user} stream={user.stream} isFollowing={isFollowing} />
  );
};

export default UserPage;
