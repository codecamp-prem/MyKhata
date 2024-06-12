import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import StocksList from "../components/StocksList";
import { StockListProps } from "../types";

const Purchase = () => {
  const navigation = useNavigation();
  const [allStocks, setItems] = useState<StockListProps[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getItemsData();
    });
  }, [db]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      // console.log("--- stocks screen get called --");
      await getItemsData();
    });
    return unsubscribe;
  }, [navigation]);

  async function getItemsData() {
    const result =
      await db.getAllAsync<StockListProps>(`SELECT s.*, i.name as item_name, 
    FROM Stocks s
    JOIN Items i ON s.item_id = i.id
    ORDER BY s.id DESC`);
    setItems(result);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 10 }}>
      <StocksList allStocks={allStocks} navigation={navigation} />
      <TouchableOpacity
        style={{
          position: "absolute",
          width: 70,
          height: 70,
          alignItems: "center",
          justifyContent: "center",
          right: 10,
          bottom: 0,
          borderColor: "red",
          backgroundColor: "#1fc435",
          borderRadius: 100,
          borderWidth: 1,
        }}
        onPress={() => navigation.navigate("AddStocks" as never)}
      >
        <Entypo name="add-to-list" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Purchase;
