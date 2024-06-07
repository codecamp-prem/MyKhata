import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
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
import { Items, PaymentStatus, SalesListAddProps } from "../types";

function AddItems() {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [itemValue, setItemValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sales_status, setSalesStatus] = useState("");
  const [sales_total, setSalesTotal] = useState("");
  const [name, setSalesCustomer] = useState("");

  const [openItemPicker, setItemPicker] = useState(false);
  const [items, setItems] = useState([{ label: "Select Item", value: "0" }]);
  const [openPayStatusPicker, setPayStatusPicker] = useState(false);
  const [payment_status, setPaymentStatus] = useState([
    { label: "Select Payment Status", value: "0" },
  ]);

  const [errors, setErrors] = useState<SalesListAddProps | undefined>();

  useLayoutEffect(() => {
    db.withTransactionAsync(async () => {
      await getItemData();
    });
  }, [db]);

  async function getItemData() {
    const result = await db.getAllAsync<Items>(`SELECT * FROM Items`);
    const newResult = result.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }));
    setItems(newResult);
    // do same for payment status
    const result1 = await db.getAllAsync<PaymentStatus>(
      `SELECT * FROM PaymentStatus`
    );

    const newResult1 = result1.map((item) => ({
      label: item.status,
      value: item.id.toString(),
    }));

    setPaymentStatus(newResult1);
  }

  const validate = () => {
    let isValid = true;

    if (!itemValue.trim()) {
      setErrors({ item_id: "Item is required" });
      isValid = false;
    }
    if (!quantity.trim()) {
      setErrors({ quantity: "Item Quantity is required" });
      isValid = false;
    }
    if (!sales_total.trim()) {
      setErrors({ sales_total: "Sales total is required" });
      isValid = false;
    }
    if (!sales_status.trim()) {
      setErrors({ sales_status: "Sales Status is required" });
      isValid = false;
    }
    return isValid;
  };
  const handleSubmit = async () => {
    if (validate()) {
      try {
        //await insert in Sales TBL (name);
        db.withTransactionAsync(async () => {
          await db.runAsync(
            `
              INSERT INTO Sales (
                item_id,
                quantity,
                sales_total,
                sales_status,
                customer_name
              )
              VALUES (?, ?, ?, ?, ?);
            `,
            [parseInt(itemValue), quantity, sales_total, sales_status, name]
          );
        });
        Alert.alert("Item Added Successfully.");
        clearFormFields();
        // Navigate back to the HomeScreen or display a success message
        navigation.navigate("Sales" as never);
      } catch (error) {
        Alert.alert("Error", "Unable to add stock. Please try again later.");
      }
    }
  };

  const clearFormFields = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sales Item:</Text>
        <DropDownPicker
          open={openItemPicker}
          value={itemValue}
          items={items}
          setOpen={setItemPicker}
          setValue={setItemValue}
          setItems={setItems}
          zIndex={3000}
          zIndexInverse={1000}
        />
        {errors?.item_id && (
          <Text style={styles.errorText}>{errors.item_id}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sales Quantity:</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter Item Quantity"
          keyboardType="numeric"
        />
        {errors?.quantity && (
          <Text style={styles.errorText}>{errors.quantity}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sales Total:</Text>
        <TextInput
          style={styles.input}
          value={sales_total}
          onChangeText={setSalesTotal}
          placeholder="Enter sales total"
          keyboardType="numeric"
        />
        {errors?.sales_total && (
          <Text style={styles.errorText}>{errors.sales_total}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sales Status:</Text>
        <DropDownPicker
          open={openPayStatusPicker}
          value={sales_status}
          items={payment_status}
          setOpen={setPayStatusPicker}
          setValue={setSalesStatus}
          setItems={setPaymentStatus}
        />
        {errors?.sales_status && (
          <Text style={styles.errorText}>{errors.sales_status}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sold to:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setSalesCustomer}
          placeholder="Enter Customer Name/Number(optional)"
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});

export default AddItems;
