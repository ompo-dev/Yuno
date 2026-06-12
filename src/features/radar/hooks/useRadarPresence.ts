import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

import { RadarPresence } from "../model";

interface UseRadarPresenceOptions {
  ghostMode?: boolean;
  ids: string[];
  onDetectedCountChange?: (count: number) => void;
  signature: string;
}

export function useRadarPresence({
  ghostMode = false,
  ids,
  onDetectedCountChange,
  signature,
}: UseRadarPresenceOptions) {
  const [presence, setPresence] = useState<Record<string, RadarPresence>>({});
  const visibilityRefs = useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    ids.forEach((id) => {
      if (!visibilityRefs.current[id]) {
        visibilityRefs.current[id] = new Animated.Value(0);
      }
    });
  }, [ids, signature]);

  useEffect(() => {
    if (!ids.length) {
      setPresence({});
      onDetectedCountChange?.(0);
      return;
    }

    const updatePresence = () => {
      const fallbackIndex = Math.floor(Math.random() * ids.length);
      const nextPresence: Record<string, RadarPresence> = {};
      let activeCount = 0;

      ids.forEach((id, index) => {
        const shouldStayActive = Math.random() > (ghostMode ? 0.18 : 0.35) || index === fallbackIndex;
        const nextActive = activeCount === 0 && index === ids.length - 1 ? true : shouldStayActive;

        if (nextActive && !ghostMode) {
          activeCount += 1;
        }

        nextPresence[id] = {
          active: nextActive,
          x: (Math.random() - 0.5) * (ghostMode ? 18 : 10),
          y: (Math.random() - 0.5) * (ghostMode ? 18 : 10),
        };

        Animated.spring(visibilityRefs.current[id], {
          toValue: nextActive ? 1 : 0,
          damping: 18,
          mass: 0.8,
          stiffness: 180,
          useNativeDriver: true,
        }).start();
      });

      setPresence(nextPresence);
      onDetectedCountChange?.(ghostMode ? 0 : activeCount);
    };

    updatePresence();
    const interval = setInterval(updatePresence, ghostMode ? 1400 : 1800);

    return () => clearInterval(interval);
  }, [ghostMode, ids, onDetectedCountChange, signature]);

  const getVisibility = (id: string) => {
    if (!visibilityRefs.current[id]) {
      visibilityRefs.current[id] = new Animated.Value(0);
    }

    return visibilityRefs.current[id];
  };

  return {
    getVisibility,
    presence,
  };
}
