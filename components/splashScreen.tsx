import * as React from "react";
import { Image, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SplashScreen = () => {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/PARDOMART.png')}
        style={[styles.logo, { width: width * 0.6 }]}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF2CC",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 50,
    maxWidth: 250,
  },
});

export default SplashScreen;
