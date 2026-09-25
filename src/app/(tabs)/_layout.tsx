import { Tabs } from "expo-router";
import {
  BotIcon,
  HomeIcon,
  PieChartIcon,
  SettingsIcon,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { fontFamily: "Rye_400Regular", fontSize: 24 },
        headerStyle: { backgroundColor: "#0D0D0D" },
        headerTintColor: "#EDE3CE",
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0D0D0D",
          borderTopColor: "#3A2E22",
          height: 65,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: "#B5652F",
        tabBarInactiveTintColor: "#A69C8D",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => <PieChartIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="ask-ai"
        options={{
          title: "Penny",
          tabBarIcon: ({ color }) => <BotIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
