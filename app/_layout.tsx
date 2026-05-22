import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORS } from "../src/constants/colors";
import { useEffect } from "react";
import { onAuthStateChange } from "../supabase/auth";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const { setSession, setProfile } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((session) => {
      setSession(session);
      // Optional: Fetch profile here if session exists
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
