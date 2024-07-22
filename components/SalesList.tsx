import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SalesListProps } from "../types";
import Card from "./ui/Card";

const SalesList = ({
  allitems,
  navigation,
}: {
  allitems: SalesListProps[];
  navigation: any;
}) => {
  return (
    <View>
      {allitems.map((item) => {
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onLongPress={() =>
              navigation.navigate("EditDeleteSales", {
                salesId: item.id,
              })
            }
          >
            <Card style={styles.container}>
              <Text style={styles.category_name}>
                {item.sales_date_year}-
                {item.sales_date_month < 10
                  ? "0" + item.sales_date_month
                  : item.sales_date_month}
                -{item.sales_date_gatey}
              </Text>
              <Text>
                {item.item_name} ({item.quantity} ओटा) रु
                {item.sales_total.toFixed(2)}
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

export default SalesList;
