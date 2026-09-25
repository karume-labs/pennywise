import { Stack } from "expo-router";
import { useUniwind } from "uniwind";

export default function SettingsLayout() {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontFamily: "Rye_400Regular" },
        headerStyle: { backgroundColor: isDark ? "#0D0D0D" : "#E8DCC4" },
        headerTintColor: isDark ? "#E8DCC4" : "#3A3A3C",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="about" options={{ title: "About Pennywise" }} />
    </Stack>
  );
}
