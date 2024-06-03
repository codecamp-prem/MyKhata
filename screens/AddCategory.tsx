import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

type Category = {
  name: string;
};
function AddCategory() {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Category | undefined>();

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      // newErrors.name = "Category name is required";
      setErrors({ name: "Category name is required" });
      isValid = false;
    }

    return isValid;
  };
  const handleSubmit = async () => {
    if (validate()) {
      try {
        //await insertStock(name, quantity, cost);
        // Navigate back to the HomeScreen or display a success message
      } catch (error) {
        Alert.alert("Error", "Unable to add stock. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Category name"
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});

export default AddCategory;
