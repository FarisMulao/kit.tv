// getSelf.test.ts

import { getSelf } from "../../lib/auth"; // Adjust the path if needed
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Mock the Clerk and DB modules
jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe("getSelf", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the user if found", async () => {
    const fakeClerkUser = { id: "abc123", username: "testuser" };
    const fakeDbUser = { id: 1, name: "DB User", externalUserId: "abc123" };

    (currentUser as jest.Mock).mockResolvedValue(fakeClerkUser);
    (db.user.findUnique as jest.Mock).mockResolvedValue(fakeDbUser);

    const result = await getSelf();
    expect(result).toEqual(fakeDbUser);
  });

  it("should throw 'Unauthorized' if no user is returned from Clerk", async () => {
    (currentUser as jest.Mock).mockResolvedValue(null);

    await expect(getSelf()).rejects.toThrow("Unauthorized");
  });

  it("should throw 'Unauthorized' if user has no username", async () => {
    const fakeClerkUser = { id: "abc123" }; // no username
    (currentUser as jest.Mock).mockResolvedValue(fakeClerkUser);

    await expect(getSelf()).rejects.toThrow("Unauthorized");
  });

  it("should throw 'Not Found' if user is not in DB", async () => {
    const fakeClerkUser = { id: "abc123", username: "testuser" };
    (currentUser as jest.Mock).mockResolvedValue(fakeClerkUser);
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(getSelf()).rejects.toThrow("Not Found");
  });
});
