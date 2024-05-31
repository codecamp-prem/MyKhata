import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Categories } from "../types";

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
            <Text>{category.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CategoriesList;
