import { useNavigation, useRoute } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Items, StockListAddProps, Stocks } from "../types";

function EditDeleteStocks() {
  const navigation = useNavigation();
  //console.log(navigation);
  const route = useRoute();
  const routeParams: {
    stockId?: number;
  } = route.params || {};

  if (
    Object.keys(routeParams).length === 0 ||
    typeof routeParams.stockId == "undefined"
  ) {
    console.log("routeParams is empty");
    return null; // or return some fallback UI
  }

  const param_stockId = routeParams.stockId;

  const db = useSQLiteContext();

  const [billNo, setBillNo] = useState("");
  const [itemId, setItemID] = useState("");
  const purchase_date_year = useRef("");
  const purchase_date_month = useRef("");
  const purchase_date_gatey = useRef("");
  const [quantity, setQuantity] = useState("");
  const [cost_per_unit, setSalesTotal] = useState("");

  const [openItemPicker, setItemPicker] = useState(false);
  const [items, setItems] = useState([{ label: "Select Item", value: "0" }]);

  const [errors, setErrors] = useState<StockListAddProps | undefined>();

  useLayoutEffect(() => {
    db.withTransactionAsync(async () => {
      await getItemData(param_stockId);
    });
  }, [db, param_stockId]);

  async function getItemData(param_stockId: number) {
    const result = await db.getAllAsync<Items>(`SELECT * FROM Items`);
    const newResult = result.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }));
    setItems(newResult);

    // get the data from the `Sales` TBL with the help of param sales_id
    // set the value to the form fields.
    const stocks_details_from_id = await db.getAllAsync<Stocks>(
      `SELECT * FROM Stocks WHERE id = ?`,
      param_stockId
    );
    setBillNo(stocks_details_from_id[0].bill_no.toString());
    setItemID(stocks_details_from_id[0].item_id.toString());
    purchase_date_year.current =
      stocks_details_from_id[0].purchase_date_year.toString();
    purchase_date_month.current =
      stocks_details_from_id[0].purchase_date_month.toString();
    purchase_date_gatey.current =
      stocks_details_from_id[0].purchase_date_gatey.toString();
    setQuantity(stocks_details_from_id[0].quantity.toString());
    setSalesTotal(stocks_details_from_id[0].cost_per_unit.toString());
    //console.log(sales_details_from_id);
  }

  async function deleteItem(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Stocks WHERE id = ?;`, [id]);
    });
    Alert.alert("Stock deleted successfully.");
    navigation.navigate("Stocks" as never);
  }

  const handleShowAlert = (item_id: number) => {
    Alert.alert(
      "Confirmation",
      "Do you want to Delete this Stock detail?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteItem(item_id),
        },
      ],
      { cancelable: true }
    );
  };

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
              UPDATE Stocks
              SET
                bill_no = ?,
                item_id = ?,
                quantity = ?,
                cost_per_unit = ?
              WHERE id = ?;
            `,
            [billNo, itemId, quantity, cost_per_unit, param_stockId]
          );
        });
        Alert.alert("Stock Updated Successfully.");
        clearFormFields();
        // Navigate back to the HomeScreen or display a success message
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
      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={handleSubmit}
        >
          <Text>Edit Stock</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnDanger]}
          onPress={() => handleShowAlert(param_stockId)}
        >
          <Text>Delete Stock</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancel</Text>
        </Pressable>
      </View>
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
  buttonGroup: {
    flexDirection: "row",
    gap: 16,
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "none",
    backgroundColor: "transparent",
    color: "inherit",
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  btnDanger: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  btnSecondary: {
    backgroundColor: "#6c757d",
    color: "#fff",
  },
});

export default EditDeleteStocks;
