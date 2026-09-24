import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useUniwind } from "uniwind";
import { NAV_THEME } from "@/lib/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";

export default function RootLayout() {
  const { theme } = useUniwind();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
