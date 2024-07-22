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
              <Text style={styles.category_name}>
                {stock.purchase_date_year}-
                {stock.purchase_date_month < 10
                  ? "0" + stock.purchase_date_month
                  : stock.purchase_date_month}
                -{stock.purchase_date_gatey}
              </Text>
              <Text>
                {stock.item_name} ({stock.quantity}ओटा * {stock.cost_per_unit}{" "}
                प्रति गोटा) = रु
                {(stock.cost_per_unit * stock.quantity).toFixed(2)}
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
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default StocksList;
