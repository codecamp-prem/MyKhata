import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { PurchaseItem, SalesItem } from "../types";
import { getNepaliMonth, getNepaliYear } from "../utils/nepaliDate";

const Reports: React.FC = () => {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [reportResult, setReportResult] = useState();

  const currentNepaliMonth = useRef(getNepaliMonth());
  const currentNepaliYear = useRef(getNepaliYear());

  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [yearValue, setYearValue] = useState(currentNepaliYear.current);
  const [monthValue, setMonthValue] = useState(currentNepaliMonth.current);
  const [reportTypeValue, setReportTypeValue] = useState("Sales");
  const [itemsReportType, setItemsReportType] = useState([
    { label: "Sales", value: "Sales" },
    { label: "Purchase", value: "Stocks" },
  ]);
  const [itemsYear, setItemsYear] = useState<
    { label: string; value: string }[]
  >([]);
  const [itemsMonth, setItemsMonth] = useState([
    { label: "Baisakh", value: "01" },
    { label: "Jestha", value: "02" },
    { label: "Asar", value: "03" },
    { label: "Shrawan", value: "04" },
    { label: "Bhadra", value: "05" },
    { label: "Aswin", value: "06" },
    { label: "Kartik", value: "07" },
    { label: "Mangsir", value: "08" },
    { label: "Poush", value: "09" },
    { label: "Magh", value: "10" },
    { label: "Falgun", value: "11" },
    { label: "Chaitra", value: "12" },
  ]);

  const onYearOpen = useCallback(() => {
    setMonthOpen(false);
    setReportOpen(false);
  }, []);

  const onMonthOpen = useCallback(() => {
    setYearOpen(false);
    setReportOpen(false);
  }, []);

  const onReportOpen = useCallback(() => {
    setYearOpen(false);
    setMonthOpen(false);
  }, []);

  // Get Years from Db : Starts Here
  const getAllYears = useCallback(async () => {
    const result = await db.getAllAsync<{ year: string }>(`
    SELECT DISTINCT Stocks.purchase_date_year AS year
    FROM Stocks
    UNION
    SELECT DISTINCT Sales.sales_date_year AS year
    FROM Sales
    ORDER BY year DESC;
    `);
    if (result) {
      let itemsYearFromDB = result.map((item) => ({
        label: item.year.toString(),
        value: item.year.toString(),
      }));
      if (
        itemsYearFromDB.some((item) => item.value === currentNepaliYear.current)
      ) {
        setItemsYear(itemsYearFromDB);
      } else {
        setItemsYear([
          {
            label: currentNepaliYear.current,
            value: currentNepaliYear.current,
          },
          ...itemsYearFromDB,
        ]);
      }
    } else {
      setItemsYear([
        { label: currentNepaliYear.current, value: currentNepaliYear.current },
      ]);
    }
    setYearValue(currentNepaliYear.current);
  }, [db, setItemsYear]);

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getAllYears();
    });
    const focusListener = navigation.addListener("focus", getAllYears);
    return () => {
      focusListener(); // Unsubscribe the listener
    };
  }, [db, navigation, getAllYears]);

  // Get Years from Db : Ends Here

  const getReportData = useCallback(async () => {
    // console.log(yearValue);
    // console.log(monthValue);
    // console.log(reportTypeValue);

    const reportQuery = `SELECT s.*,
        COALESCE(i.name, s.item_id || '(DeletedItem)') AS item_name,
        '${reportTypeValue}' AS type,
        ${
          reportTypeValue === "Sales"
            ? `SUM(s.sales_total) AS total_sales_for_this_month`
            : `SUM(s.cost_per_unit * s.quantity) AS total_purchase_for_this_month`
        }
        FROM
          ${reportTypeValue} s
        LEFT JOIN
         Items i
        ON
          s.item_id = i.id
        WHERE
          ${
            reportTypeValue === "Sales"
              ? `s.sales_date_year = ${yearValue} AND s.sales_date_month = ${monthValue}`
              : `s.purchase_date_year = ${yearValue} AND s.purchase_date_month = ${monthValue}`
          }
        GROUP BY s.id`;

    //console.log(reportQuery);

    let reportResult: (SalesItem | PurchaseItem)[];
    if (reportTypeValue === "Sales") {
      reportResult = await db.getAllAsync<SalesItem>(reportQuery);
    } else {
      reportResult = await db.getAllAsync<PurchaseItem>(reportQuery);
    }
    console.log(reportResult);
  }, [db, setReportResult, yearValue, monthValue, reportTypeValue]);

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getReportData();
    });
    const focusListener = navigation.addListener("focus", getReportData);
    return () => {
      focusListener(); // Unsubscribe the listener
    };
  }, [db, navigation, getReportData, yearValue, monthValue, reportTypeValue]);

  // Get queryResult from Sales OR Stocks Tbl for Choosen Month and Year

  // Ends here: query for Reports

  return (
    <View style={styles.container}>
      <View style={styles.dropDownContainer}>
        <DropDownPicker
          open={yearOpen}
          onOpen={onYearOpen}
          value={yearValue}
          items={itemsYear}
          setOpen={setYearOpen}
          setValue={setYearValue}
          setItems={setItemsYear}
          placeholder="Select Year"
          style={styles.dropDown}
          textStyle={styles.dropDownText}
          containerStyle={styles.dropDownContainer}
          zIndex={3000}
          zIndexInverse={1000}
        />
        <DropDownPicker
          open={monthOpen}
          onOpen={onMonthOpen}
          value={monthValue}
          items={itemsMonth}
          setOpen={setMonthOpen}
          setValue={setMonthValue}
          setItems={setItemsMonth}
          placeholder="Select Month"
          style={styles.dropDown}
          textStyle={styles.dropDownText}
          containerStyle={styles.dropDownContainer}
          zIndex={2000}
          zIndexInverse={2000}
        />
        <DropDownPicker
          open={reportOpen}
          onOpen={onReportOpen}
          value={reportTypeValue}
          items={itemsReportType}
          setOpen={setReportOpen}
          setValue={setReportTypeValue}
          setItems={setItemsReportType}
          placeholder="Select Report Type"
          style={styles.dropDown}
          textStyle={styles.dropDownText}
          containerStyle={styles.dropDownContainer}
          zIndex={1000}
          zIndexInverse={3000}
        />
      </View>
      <FlatList
        data={[...itemsYear, ...itemsMonth]}
        keyExtractor={(item) => item.value}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <Text style={styles.itemText}>{item.label}</Text>
          </View>
        )}
        contentContainerStyle={styles.itemContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  dropDownContainer: {
    width: "97%",
    marginVertical: 10,
  },
  dropDown: {
    backgroundColor: "#f1f1f1",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropDownText: {
    fontSize: 16,
  },
  itemContainer: {
    paddingHorizontal: 16,
  },
  itemWrapper: {
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  itemText: {
    fontSize: 16,
  },
});

export default Reports;
