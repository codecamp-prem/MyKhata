import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import SalesList from "../components/SalesList";
import { SalesListProps } from "../types";

const Sales = () => {
  const navigation = useNavigation();
  const [allitems, setItems] = useState<SalesListProps[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getItemsData();
    });
    navigation.addListener("focus", async () => {
      //console.log(" Sales screen get called");
      await getItemsData();
    });
  }, [db, navigation]);

  async function getItemsData() {
    const result =
      await db.getAllAsync<SalesListProps>(`SELECT s.*, i.name as item_name
    FROM Sales s
    JOIN Items i ON s.item_id = i.id
    ORDER BY s.id DESC`);
    setItems(result);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 10 }}>
      <SalesList allitems={allitems} navigation={navigation} />
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
        onPress={() => navigation.navigate("AddSales" as never)}
      >
        <Entypo name="add-to-list" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Sales;
