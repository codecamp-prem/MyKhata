import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Categories } from "../types";
import Card from "./ui/Card";

const CategoriesList = ({
  catergories,
  deleteCategory,
}: {
  catergories: Categories[];
  deleteCategory: (id: number) => Promise<void>;
}) => {
  const handleShowAlert = (category_id: number) => {
    Alert.alert(
      "Confirmation",
      "Do you want to Delete this category?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteCategory(category_id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      {catergories.map((category) => {
        return (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            onLongPress={() => handleShowAlert(category.id)}
          >
            <Card style={styles.container}>
              <Text>{category.name}</Text>
            </Card>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    //paddingBottom: 7,
    // Add other container styles as necessary
  },
});

export default CategoriesList;
