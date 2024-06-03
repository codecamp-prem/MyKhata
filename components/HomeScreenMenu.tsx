import { Feather, Fontisto, Foundation } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HomeScreenMenu = ({ navigation }: any) => {
  return (
    <View style={styles.featuresContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Category")}
        style={styles.featureBox}
      >
        <Ionicons name="stats-chart" size={50} color="#3498db" />
        <Text style={styles.featureName}>Category</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Category")}
        style={styles.featureBox}
      >
        <Foundation name="pricetag-multiple" size={50} color="#3498db" />
        <Text style={styles.featureName}>Items</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Category")}
        style={styles.featureBox}
      >
        <Fontisto name="money-symbol" size={50} color="#3498db" />
        <Text style={styles.featureName}>Sales</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Category")}
        style={styles.featureBox}
      >
        <Feather name="package" size={50} color="#3498db" />
        <Text style={styles.featureName}>Stocks</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  featuresContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
  },
  featureBox: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
  },
  featureName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
});

export default HomeScreenMenu;
