import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleOneTapCm, { GoogleOneTapCmType } from "google-one-tap-cm";
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
import { loggedInUsingButtonKey } from "../constants";
export default function App() {
  const handleLoginUsingButton = async () => {
    console.log("Login using button");
    try {
      await AsyncStorage.setItem(loggedInUsingButtonKey, "true");
      console.log("Login using button 2");
      GoogleOneTapCm.loginWithButton();
      console.log("Login using button 3");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const subscription = GoogleOneTapCm.addListener("onLogin", (payload) => {
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

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Login functions" style={styles.verticalGroup}>
          <Button title="Login" onPress={handleLoginUsingButton} />
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
