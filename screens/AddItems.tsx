import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

function AddItems() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [cost, setCost] = useState(0);

  const handleSubmit = async () => {
    try {
      //await insertStock(name, quantity, cost);
      // Navigate back to the HomeScreen or display a success message
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sales Item:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter stock name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quantity:</Text>
        <TextInput
          style={styles.input}
          value={quantity.toString()}
          onChangeText={(text) => setQuantity(parseInt(text))}
          keyboardType="numeric"
          placeholder="Enter quantity"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cost:</Text>
        <TextInput
          style={styles.input}
          value={cost.toString()}
          onChangeText={(text) => setCost(parseFloat(text))}
          keyboardType="decimal-pad"
          placeholder="Enter cost"
        />
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
});

export default AddItems;
