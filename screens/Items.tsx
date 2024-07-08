// ItemsScreen.tsx
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import ItemsList from "../components/ItemsList";
import ItemsRepository from "../services/ItemsRepository";
import { ItemsListProps } from "../types";

const ItemsScreen = () => {
  const navigation = useNavigation();
  const [allitems, setItems] = useState<ItemsListProps[]>([]);
  const itemsRepository = new ItemsRepository();

  useEffect(() => {
    const initialize = async () => {
      const result = await itemsRepository.getItemsData();
      setItems(result);

      const focusListener = navigation.addListener("focus", async () => {
        const updatedItems = await itemsRepository.getItemsData();
        setItems(updatedItems);
      });

      return () => {
        focusListener(); // Unsubscribe the listener
      };
    };
    initialize();
  }, [navigation, itemsRepository]);

  async function deleteItem(id: number) {
    await itemsRepository.deleteItem(id);
    const updatedItems = await itemsRepository.getItemsData();
    setItems(updatedItems);
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15, paddingVertical: 10, flex: 1 }}
    >
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
