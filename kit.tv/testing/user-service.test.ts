import { getUserByUsername } from "@/lib/user-service";
import { db } from "@/lib/db";

jest.mock("@/lib/db");

describe("getUserByUsername", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a user when found", async () => {
    const mockUser = { id: "1", username: "tester" };
    
    // Mock the database response
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserByUsername("tester");

    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { username: "tester" },
    });

    expect(result).toBe(mockUser);
  });

  it("returns null when no user is found", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getUserByUsername("ghost");

    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { username: "ghost" },
    });

    expect(result).toBeNull();
  });
});
