import { StyleSheet, Text, View } from "react-native";

const Loading = () => {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusText}>Loading....</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  statusText: {
    color: "#333",
    textAlign: "center",
  },
});
export default Loading;
