import { router, Stack } from "expo-router";
import { useAutoLogin } from "../hooks/useAutoLogin";
export default function RootLayout() {
  useAutoLogin(
    () => {
      console.log("Login successful");
      router.push("/home");
    },
    () => {
    },
  );

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="home"
        options={{ headerShown: true, headerBackVisible: false }}
      />
    </Stack>
  );
}
