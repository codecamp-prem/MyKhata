import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Button, ScrollView } from "react-native";
import CategoriesList from "../components/CategoriesList";
import { Categories } from "../types";

const Category = ({ navigation }: any) => {
  const [catergories, setCatergories] = useState<Categories[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getCategoryData();
    });
  }, [db]);

  async function getCategoryData() {
    const result = await db.getAllAsync<Categories>(`SELECT * FROM Categories`);
    setCatergories(result);
  }

  async function deleteCategory(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Categories WHERE id = ?;`, [id]);
      await getCategoryData();
    });
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 170 }}>
      <CategoriesList
        catergories={catergories}
        deleteCategory={deleteCategory}
      />
      <Button
        title="Add New Category"
        onPress={() => navigation.navigate("AddCategory")}
      />
    </ScrollView>
  );
};

export default Category;
