import { ActivityIndicator, Text, View } from "react-native";

const Loading = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <ActivityIndicator size={"large"} />
      <Text>Loading...</Text>
    </View>
  );
};

export default Loading;
