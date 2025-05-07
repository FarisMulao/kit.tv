"use client";

import { useEffect, useState } from "react";
import { queryButtonsAction } from "./actions";
import { Button } from "@prisma/client";

interface QueryButtonsProps {
  username: string;
}

export const EventsPanel = ({ username }: QueryButtonsProps) => {
  const [buttonEvents, setButtonEvents] = useState<Button[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const buttons = await queryButtonsAction(username);
        if (buttons.success && buttons.buttons) {
          setButtonEvents((prevButtons) => {
            const newButtons = buttons.buttons
              .filter((button: any) => button.text && button.instructions) // Filter out null values
              .map((button: any) => ({
                ...button,
                timeout: Date.now(),
              }));

            // Play sound for each new event
            newButtons.forEach((button: Button) => {
              if (button.soundName && button.soundName !== "None" && button.soundName !== "None ") {
                const audio = new Audio(`/audioClips/${button.soundName}.mp3`);
                audio
                  .play()
                  .catch((error) =>
                    console.error("Error playing sound:", error)
                  );
              }
            });

            return [...prevButtons, ...newButtons];
          });
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    // Initial fetch
    fetchEvents();

    // Set up interval for fetching new events
    const fetchInterval: NodeJS.Timeout = setInterval(fetchEvents, 2000); // Every 1 minute

    // Set up interval for clearing old events
    const clearInterval: NodeJS.Timeout = setInterval(() => {
      setButtonEvents((prevButtons) =>
        prevButtons.filter(
          (button) => Date.now() - button.timeout < 30000 // 30 seconds
        )
      );
    }, 10000); // Check every 10 seconds

    return () => {
      window.clearInterval(fetchInterval);
      window.clearInterval(clearInterval);
    };
  }, []);

  return (
    <div className="w-80 h-full bg-orange-900 p-4 overflow-y-auto" data-cy="events-panel">
      <h2 className="text-xl font-bold mb-4">Events</h2>
      <div className="space-y-4">
        {buttonEvents.map((button: Button) => (
          <div
            key={button.id + button.timeout}
            className="bg-gray-800 rounded-lg p-4 animate-fade-in"
          >
            <h3 className="font-semibold text-lg mb-2">{button.text}</h3>
            <p className="text-gray-300">{button.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
