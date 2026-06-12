import { EventsScreen } from "../../screens/EventsScreen";
import { HomeScreen } from "../../screens/HomeScreen";
import { NotesScreen } from "../../screens/NotesScreen";
import { ProfileScreen } from "../../screens/ProfileScreen";
import { useAppShellContext } from "./AppShellContext";

export function AppMainScreen() {
  const { state } = useAppShellContext();

  switch (state.activeTab) {
    case "events":
      return <EventsScreen />;
    case "notes":
      return <NotesScreen />;
    case "profile":
      return <ProfileScreen />;
    case "home":
    default:
      return <HomeScreen />;
  }
}
