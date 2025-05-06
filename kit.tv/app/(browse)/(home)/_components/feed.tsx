import { getStreams } from "@/lib/browse";
import { StreamCard } from "./stream-card";

export const Feed = async () => {
  const data = await getStreams();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Streams For You</h2>
      {data.length === 0 && <div>No streams found</div>}

      <div className="grid grid-cols-3 gap-4">
        {data.map((stream) => (
          <StreamCard
            key={stream.id}
            data={{ ...stream, name: stream.name ?? "Unknown" }}
          />
        ))}
      </div>
    </div>
  );
};

export const FeedSkeleton = () => {
  return <div></div>;
};
