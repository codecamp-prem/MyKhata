import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useLayoutEffect, useRef, useState } from "react";
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
import { Items, StockListAddProps } from "../types";
import {
  getNepaliGatey,
  getNepaliMonth,
  getNepaliYear,
} from "../utils/nepaliDate";

function AddStocks() {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [billNo, setBillNo] = useState("");
  const [itemId, setItemID] = useState("");
  const purchase_date_year = useRef(getNepaliYear());
  const purchase_date_month = useRef(getNepaliMonth());
  const purchase_date_gatey = useRef(getNepaliGatey());
  const [quantity, setQuantity] = useState("");
  const [cost_per_unit, setSalesTotal] = useState("");

  const [openItemPicker, setItemPicker] = useState(false);
  const [items, setItems] = useState([{ label: "Select Item", value: "0" }]);

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
  }

  const validate = () => {
    let isValid = true;

    if (!cost_per_unit.trim()) {
      setErrors({ cost_per_unit: "Cost Per Unit is required" });
      isValid = false;
    }
    if (!quantity.trim()) {
      setErrors({ quantity: "Item Quantity is required" });
      isValid = false;
    }
    if (!itemId.trim()) {
      setErrors({ item_id: "Item is required" });
      isValid = false;
    }
    if (!billNo.trim()) {
      setErrors({ bill_no: "Purchase Bill No. is required" });
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
                bill_no,
                item_id,
                purchase_date_year,
                purchase_date_month,
                purchase_date_gatey,
                quantity,
                cost_per_unit
              )
              VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [
              billNo,
              itemId,
              purchase_date_year.current,
              purchase_date_month.current,
              purchase_date_gatey.current,
              quantity,
              cost_per_unit,
            ]
          );
        });
        Alert.alert("Stock Added Successfully.");
        clearFormFields();
        // Navigate back to the HomeScreen or display a success message
        //navigation.navigate("Stocks" as never);
        navigation.goBack();
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
        <Text style={styles.label}>Purchase Bill No.:</Text>
        <TextInput
          style={styles.input}
          value={billNo}
          onChangeText={setBillNo}
          placeholder="Enter Purchase Bill No."
        />
        {errors?.bill_no && (
          <Text style={styles.errorText}>{errors.bill_no}</Text>
        )}
      </View>
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
        <Text style={styles.label}>
          Purchase Date: {purchase_date_year.current}-
          {purchase_date_month.current}-{purchase_date_gatey.current}
        </Text>
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
