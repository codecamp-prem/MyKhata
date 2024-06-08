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
import { Items, PaymentStatus, StockListAddProps } from "../types";

function AddStocks() {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [itemId, setItemID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [payment_status, setSalesStatus] = useState("");
  const [cost_per_unit, setSalesTotal] = useState("");
  const [supplier_name, setSalesCustomer] = useState("");

  const [openItemPicker, setItemPicker] = useState(false);
  const [items, setItems] = useState([{ label: "Select Item", value: "0" }]);
  const [openPayStatusPicker, setPayStatusPicker] = useState(false);
  const [tbl_payment_status, setPaymentStatus] = useState([
    { label: "Select Payment Status", value: "0" },
  ]);

  const [errors, setErrors] = useState<StockListAddProps | undefined>();

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

    if (!itemId.trim()) {
      setErrors({ item_id: "Item is required" });
      isValid = false;
    }
    if (!quantity.trim()) {
      setErrors({ quantity: "Item Quantity is required" });
      isValid = false;
    }
    if (!cost_per_unit.trim()) {
      setErrors({ cost_per_unit: "Cost Per Unit is required" });
      isValid = false;
    }
    if (!payment_status.trim()) {
      setErrors({ payment_status: "Payment Status is required" });
      isValid = false;
    }
    return isValid;
  };
  const handleSubmit = async () => {
    if (validate()) {
      try {
        //await insert in Stocks TBL (name);
        db.withTransactionAsync(async () => {
          await db.runAsync(
            `
              INSERT INTO Stocks (
                item_id,
                quantity,
                cost_per_unit,
                payment_status,
                supplier_name
              )
              VALUES (?, ?, ?, ?, ?);
            `,
            [
              parseInt(itemId),
              quantity,
              cost_per_unit,
              payment_status,
              supplier_name,
            ]
          );
        });
        Alert.alert("Stock Added Successfully.");
        clearFormFields();
        // Navigate back to the HomeScreen or display a success message
        navigation.navigate("Stocks" as never);
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
        <Text style={styles.label}>Stock Item:</Text>
        <DropDownPicker
          open={openItemPicker}
          value={itemId}
          items={items}
          setOpen={setItemPicker}
          setValue={setItemID}
          setItems={setItems}
          zIndex={3000}
          zIndexInverse={1000}
        />
        {errors?.item_id && (
          <Text style={styles.errorText}>{errors.item_id}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Stock Quantity:</Text>
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
        <Text style={styles.label}>Cost per Unit:</Text>
        <TextInput
          style={styles.input}
          value={cost_per_unit}
          onChangeText={setSalesTotal}
          placeholder="Enter Cost per Unit"
          keyboardType="numeric"
        />
        {errors?.cost_per_unit && (
          <Text style={styles.errorText}>{errors.cost_per_unit}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Payment Status:</Text>
        <DropDownPicker
          open={openPayStatusPicker}
          value={payment_status}
          items={tbl_payment_status}
          setOpen={setPayStatusPicker}
          setValue={setSalesStatus}
          setItems={setPaymentStatus}
        />
        {errors?.payment_status && (
          <Text style={styles.errorText}>{errors.payment_status}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Supplier Name:</Text>
        <TextInput
          style={styles.input}
          value={supplier_name}
          onChangeText={setSalesCustomer}
          placeholder="Enter Supplier Name/Number(optional)"
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

export default AddStocks;
