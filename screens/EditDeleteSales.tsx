import { useNavigation, useRoute } from "@react-navigation/native";
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
import SalesRepository, { SalesData } from "../services/SalesRepository";
import { SalesListAddProps } from "../types";

function EditDeleteSales() {
  const navigation = useNavigation();
  //console.log(navigation);
  const route = useRoute();
  const routeParams: {
    salesId?: number;
  } = route.params || {};

  if (
    Object.keys(routeParams).length === 0 ||
    typeof routeParams.salesId == "undefined"
  ) {
    console.log("routeParams is empty");
    return null; // or return some fallback UI
  }

  const param_salesId = routeParams.salesId;

  const [bill_no, setBillNo] = useState("");
  const [itemValue, setItemValue] = useState("");
  const sales_date_year = useRef("");
  const sales_date_month = useRef("");
  const sales_date_gatey = useRef("");
  const [quantity, setQuantity] = useState("");
  const [sales_total, setSalesTotal] = useState("");

  const [openItemPicker, setItemPicker] = useState(false);
  const [items, setItems] = useState([{ label: "Select Item", value: "0" }]);

  const [errors, setErrors] = useState<SalesListAddProps | undefined>();

  const salesRepository = new SalesRepository();

  useLayoutEffect(() => {
    const fetchSalesData = async () => {
      const sales_details_from_id = await salesRepository.getSalesDetailsById(
        param_salesId
      );
      if (sales_details_from_id) {
        // get the data from the `Sales` TBL with the help of param salesId
        // set the value to the form fields.
        setBillNo(sales_details_from_id.bill_no.toString());
        setItemValue(sales_details_from_id.item_id.toString());
        sales_date_year.current =
          sales_details_from_id.sales_date_year.toString();
        sales_date_month.current =
          sales_details_from_id.sales_date_month.toString();
        sales_date_gatey.current =
          sales_details_from_id.sales_date_gatey.toString();
        setQuantity(sales_details_from_id.quantity.toString());
        setSalesTotal(sales_details_from_id.sales_total.toString());
      }
    };
    fetchSalesData();
    (async () => {
      setItems(await salesRepository.getItemData());
    })();
  }, [param_salesId]);

  const handleShowAlert = (item_id: number) => {
    Alert.alert(
      "Confirmation",
      "Do you want to Delete this Sales detail?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            salesRepository.deleteSales(item_id);
            Alert.alert("Sales deleted successfully.");
            navigation.navigate("Sales" as never);
          },
        },
      ],
      { cancelable: true }
    );
  };

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
    if (!bill_no.trim()) {
      setErrors({ bill_no: "Bill no. is required" });
      isValid = false;
    }

    return isValid;
  };

  const clearFormFields = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const handleSubmit = async () => {
    if (validate()) {
      const salesData: SalesData = {
        bill_no,
        item_id: itemValue,
        sales_date_year: sales_date_year.current,
        sales_date_month: sales_date_month.current,
        sales_date_gatey: sales_date_gatey.current,
        quantity,
        sales_total,
      };

      try {
        await salesRepository.updateSales(
          param_salesId,
          salesData.bill_no,
          salesData.item_id,
          salesData.quantity,
          salesData.sales_total
        );
        Alert.alert("Sales Updated Successfully.");
        clearFormFields();
      } catch (error) {
        let errorMessage = "Unable to Update Sales. Please try again later.";
        if (error instanceof Error) {
          try {
            const errors = JSON.parse(error.message) as SalesListAddProps;
            setErrors(errors);
          } catch (parseError) {
            console.error("Error parsing error message:", parseError);
            Alert.alert("Error", errorMessage);
          }
        } else {
          console.error("Unexpected error:", error);
          Alert.alert("Error", errorMessage);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sales Bill No.:</Text>
        <TextInput
          style={styles.input}
          value={bill_no}
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
        <Text style={styles.label}>Sales Quantity: {quantity}wtf</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={(inputQty) => setQuantity(inputQty)}
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
      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={handleSubmit}
        >
          <Text>Edit Sales</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnDanger]}
          onPress={() => handleShowAlert(param_salesId)}
        >
          <Text>Delete Sales</Text>
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

export default EditDeleteSales;
