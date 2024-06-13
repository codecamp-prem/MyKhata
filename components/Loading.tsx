import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator
      animating={true}
      color={MD2Colors.red800}
      size={"large"}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
