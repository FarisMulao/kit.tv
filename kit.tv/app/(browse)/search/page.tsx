import { redirect } from "next/navigation";
import { Feed } from "./_components/feed";

interface SearchPageProps {
  searchParams: {
    term?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  if (!searchParams.term) {
    redirect("/");
  }

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Feed term={searchParams.term} />
    </div>
  );
};

export default SearchPage;
