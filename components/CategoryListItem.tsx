import { Text } from "react-native";
import { Categories } from "../types";
import Card from "./ui/Card";

interface CategoryItem {
  category: Categories;
}
const CategoryListItem = ({ category }: CategoryItem) => {
  return (
    <Card>
      <Text>{category.name}</Text>
    </Card>
  );
};

export default CategoryListItem;
