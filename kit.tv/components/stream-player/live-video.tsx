"use client";

import { Participant, Track } from "livekit-client";
import { useRef, useState, useEffect } from "react";
import { useTracks } from "@livekit/components-react";
import { FullscreenControl } from "./fullscreen-control";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "./volume-control";

interface LiveVideoProps {
  participants: Participant;
}

export const LiveVideo = ({ participants }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100); // Initialize with full volume
  const [isMuted, setIsMuted] = useState(false); // Track muted state separately

  const handleFullscreen = () => {
    if (!document.fullscreenElement && isFullscreen) {
      setIsFullscreen(false);
      return;
    }

    if (isFullscreen) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    } else if (wrapperRef?.current) {
      try {
        wrapperRef.current.requestFullscreen();
      } catch (error) {
        console.error("Error requesting fullscreen:", error);
      }
    }
  };

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    setIsFullscreen(isCurrentlyFullscreen);
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);

      // If we're unmuting, restore the previous volume
      if (!newMutedState && volume === 0) {
        setVolume(50); // Default to 50% if previously at 0
        videoRef.current.volume = 0.5;
      } else if (newMutedState) {
        // If we're muting, keep track of volume but set actual volume to 0
        videoRef.current.volume = 0;
      }
    }
  };

  // @ts-ignore
  useEventListener("fullscreenchange", handleFullscreenChange);

  // Apply tracks to video element
  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participants.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    });

  // Initialize volume when video element is created
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [videoRef.current]);

  // Calculate displayed volume value (0 when muted)
  const displayVolume = isMuted ? 0 : volume;

  return (
    <div ref={wrapperRef} className="relative h-full flex">
      <video ref={videoRef} width="100%" />

      <div className="absolute top-0 w-full h-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-t from-black px-4">
          <VolumeControl
            onChange={handleVolumeChange}
            onToggle={handleMuteToggle}
            value={displayVolume}
          />
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={handleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};
