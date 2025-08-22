import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

export default function StoreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.content}>
        <Text style={styles.title}>Store</Text>
        <Text style={styles.subtitle}>
          Store screen coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
});
