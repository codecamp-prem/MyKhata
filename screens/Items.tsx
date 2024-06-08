import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import ItemsList from "../components/ItemsList";
import { ItemsListProps } from "../types";

const ItemsScreen = () => {
  const navigation = useNavigation();
  const [allitems, setItems] = useState<ItemsListProps[]>([]);

  const db = useSQLiteContext();

  const getItemsData = useCallback(async () => {
    const result = await db.getAllAsync<ItemsListProps>(`
      SELECT i.*, c.name as category_name
      FROM Items i
      JOIN Categories c ON i.category_id = c.id
    `);
    setItems(result);
  }, [db, setItems]);

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getItemsData();
    });

    const focusListener = navigation.addListener("focus", getItemsData);

    return () => {
      focusListener(); // Unsubscribe the listener
    };
  }, [db, navigation, getItemsData]);

  async function deleteItem(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Items WHERE id = ?;`, [id]);
      await getItemsData();
    });
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 10 }}>
      <ItemsList allitems={allitems} deleteItem={deleteItem} />
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
        onPress={() => navigation.navigate("AddItems" as never)}
      >
        <Entypo name="add-to-list" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ItemsScreen;
