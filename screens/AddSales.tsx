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
import { Items, SalesListAddProps } from "../types";
import {
  getNepaliGatey,
  getNepaliMonth,
  getNepaliYear,
} from "../utils/nepaliDate";

function AddItems() {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [billNo, setBillNo] = useState("");
  const [itemValue, setItemValue] = useState("");
  const sales_date_year = useRef(getNepaliYear());
  const sales_date_month = useRef(getNepaliMonth());
  const sales_date_gatey = useRef(getNepaliGatey());
  const [quantity, setQuantity] = useState("");
  const [sales_total, setSalesTotal] = useState("");

  const [openItemPicker, setItemPicker] = useState(false);
  const [items, setItems] = useState([{ label: "Select Item", value: "0" }]);

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
  }

  const validate = () => {
    let isValid = true;

    if (!sales_total.trim()) {
      setErrors({ sales_total: "Sales total is required" });
      isValid = false;
    }

    if (!quantity.trim()) {
      setErrors({ quantity: "Item Quantity is required" });
      isValid = false;
    }

    if (!itemValue.trim()) {
      setErrors({ item_id: "Item is required" });
      isValid = false;
    }
    if (!billNo.trim()) {
      setErrors({ bill_no: "Bill no. is required" });
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
                bill_no,
                item_id,
                sales_date_year,
                sales_date_month,
                sales_date_gatey,
                quantity,
                sales_total
              )
              VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [
              billNo,
              itemValue,
              sales_date_year.current,
              sales_date_month.current,
              sales_date_gatey.current,
              quantity,
              sales_total,
            ]
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
        <Text style={styles.label}>Sales Bill No.:</Text>
        <TextInput
          style={styles.input}
          value={billNo}
          onChangeText={setBillNo}
          placeholder="Enter Bill no."
          keyboardType="numeric"
        />
        {errors?.bill_no && (
          <Text style={styles.errorText}>{errors.bill_no}</Text>
        )}
      </View>
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
        <Text style={styles.label}>
          Sold Date:{sales_date_year.current}-{sales_date_month.current}-
          {sales_date_gatey.current}
        </Text>
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

      <Button title="Add Sales" onPress={handleSubmit} />
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
