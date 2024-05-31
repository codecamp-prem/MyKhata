import { Text } from "react-native";
import { Categories } from "../types";

interface CategoryItem {
  category: Categories;
}
const CategoryListItem = ({ category }: CategoryItem) => {
  return <Text>{category.name}</Text>;
};

export default CategoryListItem;
