import { Tabs } from "expo-router";
import {
  BotIcon,
  HomeIcon,
  PieChartIcon,
  SettingsIcon,
} from "lucide-react-native";
import { useUniwind } from "uniwind";

export default function TabLayout() {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { fontFamily: "Rye_400Regular", fontSize: 24 },
        headerStyle: { backgroundColor: isDark ? "#0D0D0D" : "#E8DCC4" },
        headerTintColor: isDark ? "#E8DCC4" : "#3A3A3C",
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0D0D0D" : "#E8DCC4",
          borderTopColor: isDark ? "#3A3A3C" : "#d5c8b0",
        },
        tabBarActiveTintColor: "#6C391A",
        tabBarInactiveTintColor: "#888888",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => <PieChartIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="ask-ai"
        options={{
          title: "Penny",
          tabBarIcon: ({ color }) => <BotIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
