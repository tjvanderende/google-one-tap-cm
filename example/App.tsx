import { useEvent } from "expo";
import GoogleOneTapCm from "google-one-tap-cm";
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
  const onLoginPayload = useEvent(GoogleOneTapCm, "onLogin");
  const onLogoutPayload = useEvent(GoogleOneTapCm, "onLogout");
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
          <Button
            title="Logout"
            onPress={async () => {
              await GoogleOneTapCm.logout();
            }}
          />
        </Group>
        <Group name="Events">
          <Text>
            {onLoginPayload?.success ? "Login successful" : "Login failed"}
          </Text>
          <Text>{JSON.stringify(onLoginPayload?.successBody)}</Text>
          <Text>
            {onLogoutPayload?.success ? "Logout successful" : "Logout failed"}
          </Text>
          <Text>{JSON.stringify(onLogoutPayload?.success)}</Text>
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
