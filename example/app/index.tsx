import { useEvent } from "expo";
import { router } from "expo-router";
import GoogleOneTapCm, {
  GoogleOneTapCmType,
  useAutoLogin,
} from "google-one-tap-cm";
import { useEffect } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

export default function App() {
  /**
   * Normally you would include a few checks.
   * Usually when the user opens the app for the first time, its a good idea to not push them to login.
   * Let them press the button first, and login using the Google One Tap button.
   * - Was onboarding of the app completed?
   * - Was the user already logged in once?
   */
  useAutoLogin(
    () => {
      router.push("/home");
    },
    () => {
      console.log("Login failed");
    },
  );

  useEffect(() => {
    GoogleOneTapCm.addListener("onLogin", (payload) => {
      if (payload.success) {
        if (payload.type === GoogleOneTapCmType.PUBLIC_KEY) {
          console.log(payload.successBody?.publicKey);
          // TODO do someting with passkey.
        } else if (payload.type === GoogleOneTapCmType.PASSWORD) {
          // TODO do something with password.
          console.log(
            payload.successBody?.username,
            payload.successBody?.password,
          );
        } else if (payload.type === GoogleOneTapCmType.CUSTOM) {
          // TODO do something with ID-token.
          console.log(
            payload.successBody?.googleIdToken,
            payload.successBody?.username,
            payload.successBody?.displayName,
            payload.successBody?.profileUrl,
          );
        }
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Login functions" style={styles.verticalGroup}>
          <Button
            title="Login"
            onPress={async () => {
              await GoogleOneTapCm.loginWithButton();
            }}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: {
  name: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.group, props.style]}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  verticalGroup: {
    flexDirection: "column",
    gap: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
});
