import { getSearchResults } from "../../lib/search";
import { getSelf } from "../../lib/auth";
import { db } from "../../lib/db";

jest.mock("../../lib/auth");
jest.mock("../../lib/db");

describe("search service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns search results for authenticated users", async () => {
    (getSelf as jest.Mock).mockResolvedValue({ id: "user-id" });
    const mockResults = [
      { id: "1", name: "Cool Stream", user: { username: "cooluser" }, isLive: true },
    ];
    (db.stream.findMany as jest.Mock).mockResolvedValue(mockResults);

    const results = await getSearchResults("cool");
    expect(results).toEqual(mockResults);
    expect(db.stream.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        user: expect.objectContaining({
          NOT: expect.anything(),
        }),
        OR: expect.any(Array),
      }),
    }));
  });

  it("returns search results for unauthenticated users", async () => {
    (getSelf as jest.Mock).mockRejectedValue(new Error("not logged in"));
    const mockResults = [
      { id: "2", name: "Chill Vibes", user: { username: "chiller" }, isLive: false },
    ];
    (db.stream.findMany as jest.Mock).mockResolvedValue(mockResults);

    const results = await getSearchResults("chill");
    expect(results).toEqual(mockResults);
    expect(db.stream.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        OR: expect.any(Array),
      }),
    }));
  });
});
