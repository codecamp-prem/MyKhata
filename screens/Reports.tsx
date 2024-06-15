import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Card from "../components/ui/Card";
import { getNepaliMonth, getNepaliYear } from "../utils/nepaliDate";

const Reports = () => {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const currentNepaliMonth = useRef(getNepaliMonth());
  const currentNepaliYear = useRef(getNepaliYear());

  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [nepaliMonth, setNepaliMonth] = useState("");
  const [openItemPicker, setItemPicker] = useState(false);
  const [itemsNepaliMonth, setItemsNepaliMonth] = useState([
    { label: "Baisakh", value: "1" },
    { label: "Jestha", value: "2" },
    { label: "Asar", value: "3" },
    { label: "Shrawan", value: "4" },
    { label: "Bhadra", value: "5" },
    { label: "Aswin", value: "6" },
    { label: "Kartik", value: "7" },
    { label: "Mangsir", value: "8" },
    { label: "Poush", value: "9" },
    { label: "Magh", value: "10" },
    { label: "Falgun", value: "11" },
    { label: "Chaitra", value: "12" },
  ]);

  const getItemsData = useCallback(async () => {
    // const result = await db.getAllAsync<ItemsListProps>(`
    //   SELECT i.*, c.name as category_name
    //   FROM Items i
    //   JOIN Categories c ON i.category_id = c.id
    // `);
    // setItems(result);
    //}, [db, setItems]);
  }, [db]);

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getItemsData();
    });

    const focusListener = navigation.addListener("focus", getItemsData);

    return () => {
      focusListener(); // Unsubscribe the listener
    };
  }, [db, navigation, getItemsData]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <DropDownPicker
          open={openItemPicker}
          value={nepaliMonth}
          items={itemsNepaliMonth}
          setOpen={setItemPicker}
          setValue={setNepaliMonth}
          setItems={setItemsNepaliMonth}
          zIndex={3000}
          zIndexInverse={1000}
        />
        <DropDownPicker
          open={openItemPicker}
          value={nepaliMonth}
          items={itemsNepaliMonth}
          setOpen={setItemPicker}
          setValue={setNepaliMonth}
          setItems={setItemsNepaliMonth}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>
      <View>
        return (
        <TouchableOpacity activeOpacity={0.7}>
          <Card style={styles.container}></Card>
        </TouchableOpacity>
        );
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginVertical: 8,
  },
});

export default Reports;
