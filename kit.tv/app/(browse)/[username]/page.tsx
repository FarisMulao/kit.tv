import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";
import { isBlockedByUser } from "@/lib/block-service";

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
  const isBlocked = await isBlockedByUser(user.id);

  return (
    <div className="flex flex-col gap-y-4">
      <p data-cy="username-field">Username: {user.username}</p>
      <p>User ID: {user.id}</p>
      <p>is following: {`${isFollowing}`}</p>
      <p>is blocked by this user: {`${isBlocked}`}</p>
      <Actions
        isFollowing={isFollowing}
        isBlocked={isBlocked}
        userId={user.id}
      />
    </div>
  );
};

export default UserPage;
