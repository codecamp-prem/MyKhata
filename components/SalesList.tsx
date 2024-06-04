import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SalesListProps } from "../types";
import Card from "./ui/Card";

const SalesList = ({
  allitems,
  deleteItem,
}: {
  allitems: SalesListProps[];
  deleteItem: (id: number) => Promise<void>;
}) => {
  const handleShowAlert = (item_id: number) => {
    Alert.alert(
      "Confirmation",
      "Do you want to Delete this Sales detail?",
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
              <Text style={styles.category_name}>{item.payment_status}</Text>
              <Text>
                {item.sales_date.split(" ")[0]} {item.item_name} Rs.
                {item.sales_total}
              </Text>
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

export default SalesList;
