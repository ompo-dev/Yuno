import { LayoutRectangle, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";

import { canAccessEncounter, getMutualConnections } from "../../../encounterUtils";
import { EncounterDetailContextValue, EncounterDetailProviderProps, ActiveEncounterMenu } from "./types";

function measureMenuAnchor(
  anchorRef: View | null,
  onMeasured: (anchor: LayoutRectangle) => void,
) {
  if (!anchorRef) {
    return;
  }

  anchorRef.measureInWindow((x, y, width, height) => {
    onMeasured({
      height,
      width,
      x,
      y,
    });
  });
}

export function useEncounterDetailState(
  props: EncounterDetailProviderProps,
): EncounterDetailContextValue {
  const [cachedEncounter, setCachedEncounter] = useState(props.encounter);
  const [activeMenu, setActiveMenu] = useState<ActiveEncounterMenu>(null);
  const headerMenuAnchorRef = useRef<View | null>(null);
  const noteMenuAnchorRefs = useRef<Record<string, View | null>>({});
  const activeEncounter = props.encounter ?? cachedEncounter;

  useEffect(() => {
    if (props.encounter) {
      setCachedEncounter(props.encounter);
    }
  }, [props.encounter]);

  useEffect(() => {
    setActiveMenu(null);
  }, [activeEncounter?.id]);

  const mutualConnections = useMemo(
    () => getMutualConnections(props.allEncounters, activeEncounter),
    [activeEncounter, props.allEncounters],
  );
  const canInteract = activeEncounter ? canAccessEncounter(activeEncounter) : false;
  const eventTone =
    activeEncounter?.eventTone === "green"
      ? "green"
      : activeEncounter?.eventTone === "purple"
        ? "purple"
        : "blue";

  const actions: EncounterDetailContextValue["actions"] = {
    closeSheet: () => {
      setActiveMenu(null);
      props.onClose();
    },
    deleteNote: (noteId) => {
      setActiveMenu(null);
      props.onDeleteNote(noteId);
    },
    dismissMenus: () => setActiveMenu(null),
    editNote: (note) => {
      setActiveMenu(null);
      props.onEditNote(note);
    },
    openEncounterEvent: () => {
      if (!activeEncounter) {
        return;
      }

      setActiveMenu(null);
      props.onOpenEvent(activeEncounter.eventId);
    },
    openMutualConnectionsSheet: () => {
      if (!mutualConnections.length) {
        return;
      }

      setActiveMenu(null);
      props.onOpenMutualConnections(
        props.copy.detail.mutualConnections(mutualConnections.length),
        mutualConnections.map((item) => item.id),
      );
    },
    openSharedEventsSheet: () => {
      if (!activeEncounter) {
        return;
      }

      setActiveMenu(null);
      props.onOpenSharedEvents(
        props.copy.detail.sharedEvents(activeEncounter.sharedEventIds.length),
        activeEncounter.sharedEventIds,
      );
    },
    requestCreateNote: () => {
      if (!activeEncounter) {
        return;
      }

      setActiveMenu(null);
      props.onRequestCreateNote(activeEncounter.id);
    },
    setHeaderMenuAnchor: (node) => {
      headerMenuAnchorRef.current = node;
    },
    setNoteMenuAnchor: (noteId, node) => {
      noteMenuAnchorRefs.current[noteId] = node;
    },
    toggleConnect: () => {
      if (!activeEncounter) {
        return;
      }

      props.onToggleConnect(activeEncounter.id);
    },
    toggleHeaderMenu: () => {
      if (activeMenu?.type === "header") {
        setActiveMenu(null);
        return;
      }

      measureMenuAnchor(headerMenuAnchorRef.current, (anchor) => {
        setActiveMenu({ anchor, type: "header" });
      });
    },
    toggleNoteMenu: (note) => {
      if (activeMenu?.type === "note" && activeMenu.note.id === note.id) {
        setActiveMenu(null);
        return;
      }

      measureMenuAnchor(noteMenuAnchorRefs.current[note.id], (anchor) => {
        setActiveMenu({ anchor, note, type: "note" });
      });
    },
  };

  return {
    actions,
    derived: {
      activeEncounter,
      activeMenu,
      canInteract,
      eventTone,
      mutualConnections,
    },
    props,
  };
}
