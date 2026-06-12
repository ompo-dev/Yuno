import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { ScreenTransition } from "./src/components/atoms";
import {
  AppBackground,
  TabBar,
} from "./src/components/organisms";
import {
  AppMainScreen,
  AppModalLayer,
  AppShellProvider,
  useAppShellContext,
} from "./src/features/app-shell";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { theme } from "./src/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShellProvider>
        <AppRoot />
      </AppShellProvider>
    </SafeAreaProvider>
  );
}

function AppRoot() {
  const {
    actions,
    bottomInset,
    copy,
    state,
  } = useAppShellContext();

  if (!state.hasCompletedOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        <AppBackground />
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <OnboardingScreen />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <AppBackground />
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.appShell}>
          <View style={styles.content}>
            <ScreenTransition transitionKey={state.activeTab}>
              <AppMainScreen />
            </ScreenTransition>
          </View>

          <View
            style={[
              styles.tabBarWrap,
              { bottom: Math.max(14, Math.round(bottomInset * 0.55)) },
            ]}
          >
            <TabBar
              activeTab={state.activeTab}
              bottomInset={bottomInset}
              copy={copy}
              onTabPress={actions.setActiveTab}
            />
          </View>
        </View>

        <AppModalLayer />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appShell: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  tabBarWrap: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 0,
    paddingBottom: 0,
    backgroundColor: "transparent",
  },
});
