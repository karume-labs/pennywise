import { Stack } from "expo-router";
import { useUniwind } from "uniwind";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontFamily: "Rye_400Regular" },
        headerStyle: { backgroundColor: "#0D0D0D" },
        headerTintColor: "#EDE3CE",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="about" options={{ title: "About Pennywise" }} />
    </Stack>
  );
}
