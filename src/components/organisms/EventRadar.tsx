import { memo, useMemo } from "react";

import { EventRadarNodes, RadarFrame } from "../../features/radar/components";
import { useRadarAnimations } from "../../features/radar/hooks";
import { EventSummary, Language } from "../../types";

interface EventRadarProps {
  events: EventSummary[];
  language: Language;
  onOpenEvent: (event: EventSummary) => void;
}

export const EventRadar = memo(function EventRadar({
  events,
  language,
  onOpenEvent,
}: EventRadarProps) {
  const activeEvents = useMemo(
    () => events.filter((event) => event.status !== "recent"),
    [events],
  );
  const { nodePulseScale, pulseOpacity, pulseScale, rotation } = useRadarAnimations();

  return (
    <RadarFrame
      nodePulseScale={nodePulseScale}
      pulseOpacity={pulseOpacity}
      pulseScale={pulseScale}
      rotation={rotation}
    >
      <EventRadarNodes
        events={activeEvents}
        language={language}
        nodePulseScale={nodePulseScale}
        onOpenEvent={onOpenEvent}
      />
    </RadarFrame>
  );
});
