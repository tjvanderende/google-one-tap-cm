import { useEvent } from "expo";
import GoogleOneTapCm, { useAutoLogin } from "google-one-tap-cm";
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
