import { getButtonQueue, pressButton } from "../../lib/button-queue-service";
import { getButtons, createButton } from "../../lib/button-service";
import { db } from "../../lib/db";
import { getSelf } from "../../lib/auth-service";
import { Button } from "@prisma/client";

//getButtonQueue

// Mock modules
jest.mock("../../lib/db", () => ({
  db: {
    stream: { findFirst: jest.fn() },
    buttonQueue: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    button: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("../../lib/auth-service", () => ({
  getSelf: jest.fn(),
}));

describe("getButtonQueue", () => {
  it("returns buttons when user is live and has a queue", async () => {
    (getSelf as jest.Mock).mockResolvedValue({ id: "user123" });

    (db.stream.findFirst as jest.Mock).mockResolvedValue({ isLive: true });

    (db.buttonQueue.findMany as jest.Mock).mockResolvedValue([
      { id: "q1", buttonId: "b1" },
    ]);

    (db.buttonQueue.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    (db.button.findMany as jest.Mock).mockResolvedValue([
      { id: "b1", label: "Test Button" },
    ]);

    const result = await getButtonQueue();

    expect(result).toEqual([{ id: "b1", label: "Test Button" }]);
  });
});

//pressButton

describe("pressButton", () => {
  it("returns true when button press is valid", async () => {
    (getSelf as jest.Mock).mockResolvedValue({ id: "user123" });

    (db.button.findFirst as jest.Mock).mockResolvedValue({
      id: "btn1",
      streamerId: "streamer123",
      timeout: 10000,
    });

    (db.stream.findFirst as jest.Mock).mockResolvedValue({ isLive: true });

    (db.buttonQueue.findFirst as jest.Mock).mockResolvedValue(null);

    (db.buttonQueue.create as jest.Mock).mockResolvedValue({ id: "new-press" });

    const result = await pressButton("btn1");

    expect(result).toBe(true);
  });
});

jest.mock("../../lib/auth");
jest.mock("../../lib/db");

describe("button-service", () => {
  const mockUser = { id: "user-id" };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSelf as jest.Mock).mockResolvedValue(mockUser);
  });

  describe("getButtons", () => {
    it("returns an array of buttons for a streamer", async () => {
      const buttons = [
        { id: "b1", streamerId: "user-id", text: "Hello", color: "red", instructions: "", soundName: null },
      ] as Button[];
      (db.button.findMany as jest.Mock).mockResolvedValue(buttons);

      const result = await getButtons("user-id");
      expect(result).toEqual(buttons);
      expect(db.button.findMany).toHaveBeenCalledWith({
        where: { streamerId: "user-id" },
      });
    });
  });

  describe("createButton", () => {
    it("creates a button for the authed user", async () => {
      const button = {
        id: "b2",
        streamerId: "user-id",
        text: "Click Me",
        color: "green",
        instructions: "Do something",
        soundName: "beep",
      } as Button;

      (db.button.create as jest.Mock).mockResolvedValue(button);

      const result = await createButton(button);
      expect(result).toBe(true);
      expect(db.button.create).toHaveBeenCalledWith({
        data: {
          text: button.text,
          color: button.color,
          instructions: button.instructions,
          streamerId: button.streamerId,
          soundName: button.soundName,
        },
      });
    });

    it("returns false if user tries to create a button for someone else", async () => {
      const button = {
        id: "b2",
        streamerId: "someone-else",
        text: "Nope",
        color: "blue",
        instructions: "Forbidden",
        soundName: "buzz",
      } as Button;

      const result = await createButton(button);
      expect(result).toBe(false);
      expect(db.button.create).not.toHaveBeenCalled();
    });
  });
});