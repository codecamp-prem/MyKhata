import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { Categories } from "../types";
import CategoryListItem from "./CategoryListItem";

const CategoriesList = ({
  catergories,
  deleteCategory,
}: {
  catergories: Categories[];
  deleteCategory: (id: number) => Promise<void>;
}) => {
  const handleShowAlert = (category_id: number) => {
    Alert.alert(
      "Confirmation",
      "Do you want to Delete this category?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteCategory(category_id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      {catergories.map((category) => {
        return (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            onLongPress={() => handleShowAlert(category.id)}
          >
            {/* category item */}
            <CategoryListItem category={category} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CategoriesList;
