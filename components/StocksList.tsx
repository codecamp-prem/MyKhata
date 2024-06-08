import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StockListProps } from "../types";
import Card from "./ui/Card";

const StocksList = ({
  allStocks,
  navigation,
}: {
  allStocks: StockListProps[];
  navigation: any;
}) => {
  return (
    <View>
      {allStocks.map((stock) => {
        return (
          <TouchableOpacity
            key={stock.id}
            activeOpacity={0.7}
            onLongPress={() =>
              navigation.navigate("EditDeleteStocks", {
                stockId: stock.id,
              })
            }
          >
            <Card style={styles.container}>
              <Text style={styles.category_name}>{stock.payment_status}</Text>
              <Text>
                {stock.billed_date.split(" ")[0]} {stock.item_name} (
                {stock.quantity} * {stock.cost_per_unit}) = रु
                {stock.cost_per_unit * stock.quantity}
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

export default StocksList;
