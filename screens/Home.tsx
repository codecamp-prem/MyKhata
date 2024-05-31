import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Categories, Items } from "../types";

export default function Home() {
  const [catergories, setCatergories] = useState<Categories[]>([]);
  const [items, setItems] = useState<Items[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync<Categories>(`SELECT * FROM Categories`);
    setCatergories(result);
  }

  return (
    <View>
      <Text> Home Screen</Text>
    </View>
  );
}
