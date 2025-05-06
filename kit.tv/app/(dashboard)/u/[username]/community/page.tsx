import { getSelf } from "@/lib/auth-service";
import { getBlockedUsers } from "@/lib/block-service";
import BlockedUserCard from "./_components/blocked-user-card";

const CommunityPage = async () => {
    const self = await getSelf();
    const blockList = await getBlockedUsers(self.id);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">Blocked Users</h1>
            </div>
            <div className="space-y-4">
                {blockList.blockedUsers && blockList.blockedUsers.map((user) => (
                    <BlockedUserCard key={user.blocked.id} user={user} />
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;
