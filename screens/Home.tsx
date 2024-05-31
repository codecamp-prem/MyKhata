import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import CategoriesList from "../components/CategoriesList";
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

  async function deleteCategory(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Categories WHERE id = ?;`, [id]);
      await getData();
    });
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 10, paddingVertical: 170 }}>
      <CategoriesList
        catergories={catergories}
        deleteCategory={deleteCategory}
      />
    </ScrollView>
  );
}
