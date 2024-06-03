import { Entypo } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
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
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 10 }}>
      <CategoriesList
        catergories={catergories}
        deleteCategory={deleteCategory}
      />
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
        onPress={() => navigation.navigate("AddCategory")}
      >
        <Entypo name="add-to-list" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Category;
