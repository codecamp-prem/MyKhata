import { useLayoutEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ItemsRepository from "../services/ItemsRepository";
import { ItemsListAddProps } from "../types";

function AddItems() {
  const itemsRepository = new ItemsRepository();

  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setCategory] = useState("");
  const [items, setItems] = useState([
    { label: "Select Category for Item", value: "0" },
  ]);
  const [errors, setErrors] = useState<ItemsListAddProps | undefined>();

  useLayoutEffect(() => {
    (async () => {
      const categories = await itemsRepository.getCategoryData();
      setItems(categories);
    })();
  }, []);

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setErrors({ name: "Item name is required" });
      isValid = false;
    }
    if (!value.trim()) {
      setErrors({ category_id: "Item Category is required" });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await itemsRepository.addItem(parseInt(value), name);
        Alert.alert("Item Added Successfully.");
        clearFormFields();
      } catch (error) {
        Alert.alert("Error", "Unable to add stock. Please try again later.");
      }
    }
  };

  const clearFormFields = () => {
    setName("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Item Category:</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setItems}
        />
        {errors?.category_id && (
          <Text style={styles.errorText}>{errors.category_id}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Item Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Item Name"
        />
        {errors?.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      <Button title="Add Stock" onPress={handleSubmit} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});

export default AddItems;
