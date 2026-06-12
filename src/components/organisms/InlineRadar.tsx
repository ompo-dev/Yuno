import { memo, useMemo } from "react";

import {
  EncounterRadarNodes,
  GhostRadarNodes,
  RadarFrame,
} from "../../features/radar/components";
import { useRadarAnimations, useRadarPresence } from "../../features/radar/hooks";
import {
  buildEncounterRadarSignature,
  getEncounterRadarPoints,
  GHOST_IDS,
} from "../../features/radar/model";
import { Encounter } from "../../types";

interface InlineRadarProps {
  encounters: Encounter[];
  ghostMode?: boolean;
  onDetectedCountChange?: (count: number) => void;
  onOpenEncounter: (encounter: Encounter) => void;
}

export const InlineRadar = memo(function InlineRadar({
  encounters,
  ghostMode = false,
  onDetectedCountChange,
  onOpenEncounter,
}: InlineRadarProps) {
  const points = useMemo(() => getEncounterRadarPoints(encounters), [encounters]);
  const sourceIds = useMemo(
    () => (ghostMode ? GHOST_IDS : points.map((point) => point.id)),
    [ghostMode, points],
  );
  const signature = useMemo(
    () => (ghostMode ? GHOST_IDS.join("|") : buildEncounterRadarSignature(points)),
    [ghostMode, points],
  );
  const { nodePulseScale, pulseOpacity, pulseScale, rotation } = useRadarAnimations({
    nodeDuration: 950,
    nodeScaleRange: [1, ghostMode ? 1.06 : 1.1],
    pulseDuration: 1600,
    pulseOpacityRange: [ghostMode ? 0.12 : 0.22, 0],
    rotationDuration: 3200,
  });
  const { getVisibility, presence } = useRadarPresence({
    ghostMode,
    ids: sourceIds,
    onDetectedCountChange,
    signature,
  });

  return (
    <RadarFrame
      ghostMode={ghostMode}
      nodePulseScale={nodePulseScale}
      pulseOpacity={pulseOpacity}
      pulseScale={pulseScale}
      rotation={rotation}
    >
      {ghostMode ? (
        <GhostRadarNodes
          getVisibility={getVisibility}
          nodePulseScale={nodePulseScale}
          presence={presence}
        />
      ) : (
        <EncounterRadarNodes
          encounters={points}
          getVisibility={getVisibility}
          nodePulseScale={nodePulseScale}
          onOpenEncounter={onOpenEncounter}
          presence={presence}
        />
      )}
    </RadarFrame>
  );
});
