import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORS } from "../src/constants/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="auth/login" />
      </Stack>
    </SafeAreaProvider>
  );
}
