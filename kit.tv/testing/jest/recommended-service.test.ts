import { getRecommended } from "../../lib/recommended-service";
import { getSelf } from "../../lib/auth-service";
import { db } from "../../lib/db";

// Tell Jest to mock these modules (so we control their behavior)
jest.mock("@/lib/auth-service");
jest.mock("@/lib/db");

describe("getRecommended", () => {
  afterEach(() => {
    jest.clearAllMocks(); // resets any mocks between tests
  });

  it("returns recommended users when a user is logged in", async () => {
    // Fake logged-in user
    (getSelf as jest.Mock).mockResolvedValue({ id: "user1" });

    // Fake DB response
    const fakeUsers = [{ id: "user2" }, { id: "user3" }];
    (db.user.findMany as jest.Mock).mockResolvedValue(fakeUsers);

    const result = await getRecommended();

    // ✅ We expect to get those fake users back
    expect(result).toEqual(fakeUsers);

    // ✅ We expect the DB to be called with the filter logic
    expect(db.user.findMany).toHaveBeenCalledWith({
      where: {
        AND: [
          { NOT: { id: "user1" } },
          {
            NOT: {
              followedBy: {
                some: { followerId: "user1" },
              },
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns all users when no user is logged in", async () => {
    // Simulate failure to get current user (e.g. not logged in)
    (getSelf as jest.Mock).mockRejectedValue(new Error("Unauthorized"));

    const fakeUsers = [{ id: "userA" }, { id: "userB" }];
    (db.user.findMany as jest.Mock).mockResolvedValue(fakeUsers);

    const result = await getRecommended();

    // ✅ Should return the full list
    expect(result).toEqual(fakeUsers);

    // ✅ Should call DB without filtering out the current user
    expect(db.user.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });
});
