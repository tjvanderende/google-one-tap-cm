import { Text, SafeAreaView, View, StyleSheet, Button } from "react-native";
import GoogleOneTapCm from "google-one-tap-cm";
import { useEffect } from "react";
import { router } from "expo-router";
export default function Home() {
  useEffect(() => {
    const subscription = GoogleOneTapCm.addListener("onLogout", () => {
      router.push("/");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Logged In</Text>
        <Button title="Logout" onPress={() => {
          GoogleOneTapCm.logout();
        }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
