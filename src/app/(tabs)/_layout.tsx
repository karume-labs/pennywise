import { Tabs } from "expo-router";
import { BotIcon, HomeIcon, PieChartIcon } from "lucide-react-native";
import { useUniwind } from "uniwind";

export default function TabLayout() {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#000000" : "#ffffff",
          borderTopColor: isDark ? "#333333" : "#e5e5e5",
        },
        tabBarActiveTintColor: isDark ? "#ffffff" : "#000000",
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
          title: "Ask AI",
          tabBarIcon: ({ color }) => <BotIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
