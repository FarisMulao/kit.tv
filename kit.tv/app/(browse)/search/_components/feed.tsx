import { getSearchResults } from "@/lib/search-service";
import { StreamCard } from "../../(home)/_components/stream-card";

interface FeedProps {
  term?: string;
}

export const Feed = async ({ term }: FeedProps) => {
  const data = await getSearchResults(term);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Results for term "{term}"</h2>
      {data.length === 0 && <div>No results found</div>}
      <div className=" flx-col grid grid-cols-3 gap-6">
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
