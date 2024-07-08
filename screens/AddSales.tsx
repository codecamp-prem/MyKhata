import { useNavigation } from "@react-navigation/native";
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
import SalesRepository, { SalesData } from "../services/SalesRepository";
import { SalesListAddProps } from "../types";
import {
  getNepaliGatey,
  getNepaliMonth,
  getNepaliYear,
} from "../utils/nepaliDate";

function AddItems() {
  const navigation = useNavigation();

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

  const salesRepository = new SalesRepository();

  useLayoutEffect(() => {
    (async () => {
      setItems(await salesRepository.getItemData());
    })();
  }, []);

  const handleSubmit = async () => {
    const salesData: SalesData = {
      bill_no: billNo,
      item_id: itemValue,
      sales_date_year: sales_date_year.current,
      sales_date_month: sales_date_month.current,
      sales_date_gatey: sales_date_gatey.current,
      quantity,
      sales_total,
    };

    try {
      await salesRepository.addSales(salesData);
      Alert.alert("Item Added Successfully.");
      clearFormFields();
      navigation.navigate("Sales" as never);
    } catch (error) {
      let errorMessage = "Unable to add stock. Please try again later.";
      if (error instanceof Error) {
        try {
          const errors = JSON.parse(error.message) as SalesListAddProps;
          setErrors(errors);
          errorMessage =
            "There was an error adding the item. Please check the form and try again.";
        } catch (parseError) {
          console.error("Error parsing error message:", parseError);
        }
      } else {
        console.error("Unexpected error:", error);
      }
      Alert.alert("Error", errorMessage);
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
