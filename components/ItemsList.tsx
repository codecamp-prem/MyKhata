import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ItemsListProps } from "../types";
import Card from "./ui/Card";

const ItemsList = ({
  allitems,
  deleteItem,
}: {
  allitems: ItemsListProps[];
  deleteItem: (id: number) => Promise<void>;
}) => {
  const handleShowAlert = (item_id: number) => {
    Alert.alert(
      "Confirmation",
      "Do you want to Delete this Item?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteItem(item_id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      {allitems.map((item) => {
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onLongPress={() => handleShowAlert(item.id)}
          >
            <Card style={styles.container}>
              <Text style={styles.category_name}>{item.category_name}</Text>
              <Text>{item.name}</Text>
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
  category_name: {
    fontSize: 10,
  },
});

export default ItemsList;
