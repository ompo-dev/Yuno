import { useEffect, useMemo, useState } from "react";

import {
  getConnectedEventAttendees,
  getEventGuests,
} from "../../../encounterUtils";
import { resolveLocalizedText } from "../../../i18n";
import { EventDetailContextValue, EventDetailProviderProps } from "./types";

function getStatusTone(status: EventDetailProviderProps["event"] extends infer T ? T extends { status: infer S } ? S : never : never) {
  if (status === "live") {
    return "green" as const;
  }

  if (status === "upcoming") {
    return "blue" as const;
  }

  return "purple" as const;
}

function parseTimeRange(value: string) {
  const [datePart, timePart] = value.split(",");
  return {
    date: datePart?.trim() ?? value,
    time: timePart?.trim() ?? value,
  };
}

export function useEventDetailState(
  props: EventDetailProviderProps,
): EventDetailContextValue {
  const [cachedEvent, setCachedEvent] = useState(props.event);
  const activeEvent = props.event ?? cachedEvent;

  useEffect(() => {
    if (props.event) {
      setCachedEvent(props.event);
    }
  }, [props.event]);

  const guests = useMemo(
    () => (activeEvent ? getEventGuests(props.encounters, activeEvent.id) : []),
    [activeEvent, props.encounters],
  );
  const connectedAttendees = useMemo(
    () =>
      activeEvent ? getConnectedEventAttendees(props.encounters, activeEvent.id) : [],
    [activeEvent, props.encounters],
  );
  const statusTone = activeEvent ? getStatusTone(activeEvent.status) : "blue";
  const timeRange = activeEvent
    ? parseTimeRange(resolveLocalizedText(activeEvent.timeRange, props.language))
    : { date: "", time: "" };

  const actions: EventDetailContextValue["actions"] = {
    closeSheet: props.onClose,
    openEncounter: props.onOpenEncounter,
    toggleJoinEvent: () => {
      if (activeEvent) {
        props.onToggleJoin(activeEvent.id);
      }
    },
    toggleSaveEvent: () => {
      if (activeEvent) {
        props.onToggleSaved(activeEvent.id);
      }
    },
  };

  return {
    actions,
    derived: {
      activeEvent,
      connectedAttendees,
      guests,
      statusTone,
      timeRange,
    },
    props,
  };
}
