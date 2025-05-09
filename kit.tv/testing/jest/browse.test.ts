import { getStreams } from "../../lib/browse";
import { getSelf } from "../../lib/auth";
import { db } from "../../lib/db";

jest.mock("../../lib/auth");
jest.mock("../../lib/db");

describe("browse service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns streams for authenticated user, filtering blocked users", async () => {
    (getSelf as jest.Mock).mockResolvedValue({ id: "user-id" });
    const mockStreams = [
      { id: "1", user: {}, thumbnailUrl: "", name: "Test", isLive: true },
    ];
    (db.stream.findMany as jest.Mock).mockResolvedValue(mockStreams);

    const result = await getStreams();
    expect(result).toEqual(mockStreams);
    expect(db.stream.findMany).toHaveBeenCalledWith({
      where: {
        user: {
          NOT: {
            blocking: {
              some: {
                blockerId: "user-id",
              },
            },
          },
        },
      },
      select: {
        id: true,
        user: true,
        thumbnailUrl: true,
        name: true,
        isLive: true,
      },
      orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
    });
  });

  it("returns streams for unauthenticated user", async () => {
    (getSelf as jest.Mock).mockRejectedValue(new Error("Not logged in"));
    const mockStreams = [
      { id: "2", user: {}, thumbnailUrl: "", name: "Test2", isLive: false },
    ];
    (db.stream.findMany as jest.Mock).mockResolvedValue(mockStreams);

    const result = await getStreams();
    expect(result).toEqual(mockStreams);
    expect(db.stream.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        user: true,
        thumbnailUrl: true,
        name: true,
        isLive: true,
      },
      orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
    });
  });
});
