import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Button, ScrollView } from "react-native";
import CategoriesList from "../components/CategoriesList";
import { Categories } from "../types";

const Category = ({ navigation }: any) => {
  const [catergories, setCatergories] = useState<Categories[]>([]);
  const db = useSQLiteContext();
  async function deleteCategory(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Categories WHERE id = ?;`, [id]);
      // await getData();
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
