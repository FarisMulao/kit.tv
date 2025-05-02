import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Mock the utility functions
jest.mock("clsx");
jest.mock("tailwind-merge");

describe("cn function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("combines class names and merges Tailwind classes", () => {
    const input = ["bg-red-500", "text-white", "p-4"];
    const mergedOutput = "bg-red-500 text-white p-4"; // expected output

    // Mock the behavior of clsx and twMerge
    (clsx as jest.Mock).mockReturnValue("bg-red-500 text-white p-4");
    (twMerge as jest.Mock).mockReturnValue(mergedOutput);

    const result = cn(...input);

    expect(clsx).toHaveBeenCalledWith(input); // Check that clsx was called with the correct arguments
    expect(twMerge).toHaveBeenCalledWith("bg-red-500 text-white p-4"); // Check that twMerge was called with the result from clsx
    expect(result).toBe(mergedOutput); // Finally, check that the result matches the merged output
  });
});
