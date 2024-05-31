import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Categories } from "../types";
import CategoryListItem from "./CategoryListItem";

const CategoriesList = ({
  catergories,
  deleteCategory,
}: {
  catergories: Categories[];
  deleteCategory: (id: number) => Promise<void>;
}) => {
  return (
    <View>
      {catergories.map((category) => {
        return (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            onLongPress={() => deleteCategory(category.id)}
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
