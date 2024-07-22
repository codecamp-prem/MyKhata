import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import SalesList from "../components/SalesList";
import StocksList from "../components/StocksList";
import Card from "../components/ui/Card";
import { theme } from "../core/theme";
import { SalesListProps, StockListProps } from "../types";
import { getNepaliMonth, getNepaliYear } from "../utils/nepaliDate";

const Reports: React.FC = () => {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [reportResultSale, setReportResultSale] = useState<SalesListProps[]>(
    []
  );
  const [reportResultPurchase, setReportResultPurchase] = useState<
    StockListProps[]
  >([]);

  const currentNepaliMonth = useRef(getNepaliMonth());
  const currentNepaliYear = useRef(getNepaliYear());

  const [headingFor, setHeadingFor] = useState("Sales");
  const [headingDetails, setHeadingDetails] = useState({
    count: "0",
    total: "0.00",
  });
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
    try {
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
          itemsYearFromDB.some(
            (item) => item.value === currentNepaliYear.current
          )
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
          {
            label: currentNepaliYear.current,
            value: currentNepaliYear.current,
          },
        ]);
      }

      setYearValue(currentNepaliYear.current);
    } catch (error) {
      console.error("Error getting years from the database:", error);
    }
  }, [db, setItemsYear]);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", getAllYears);

    getAllYears();

    return () => {
      focusListener(); // Unsubscribe the listener
    };
  }, [db, navigation, getAllYears]);
  // Get Years from Db : Ends Here

  // Report Result Info
  const ResultInfo = ({
    headingFor,
    headingDetails,
  }: {
    headingFor: string;
    headingDetails: { count: string; total: string };
  }) => {
    return (
      <View>
        <Card style={styles.resultInfoContainer}>
          <Text style={styles.resultInfoHeading}>{headingFor}</Text>
          <Text style={styles.resultInfoDetails}>
            Total {headingFor}: {headingDetails.count}, Total Amount: रु
            {headingDetails.total}
          </Text>
        </Card>
      </View>
    );
  };
  // Get queryResult from Sales OR Stocks Tbl for Choosen Month and Year
  const getReportData = useCallback(async () => {
    try {
      // '${reportTypeValue}' AS type,
      // ${
      //   reportTypeValue === "Sales"
      //     ? `SUM(s.sales_total) AS total_sales_for_this_month`
      //     : `SUM(s.cost_per_unit * s.quantity) AS total_purchase_for_this_month`
      // }
      // FROM
      //   ${reportTypeValue} s

      const reportQuery = `SELECT s.*, 
      COALESCE(i.name, s.item_id || '(DeletedItem)') AS item_name,
      '${reportTypeValue}' AS type
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

      if (reportTypeValue === "Sales") {
        setHeadingFor("Sales");
        const salesResult = await db.getAllAsync<SalesListProps>(reportQuery);
        // get sales total for month to show
        if (salesResult.length !== 0) {
          const totalSalesForThisMonth = salesResult.reduce(
            (sum, item) => sum + item.sales_total,
            0
          );
          setHeadingDetails({
            count: salesResult.length.toString(),
            total: totalSalesForThisMonth.toFixed(2).toString(),
          });
        } else {
          setHeadingDetails({
            count: "0",
            total: "0.00",
          });
        }
        // set salesResult to setReportResultSale
        setReportResultSale(salesResult);
      } else {
        setHeadingFor("Purchase");
        const stockResult = await db.getAllAsync<StockListProps>(reportQuery);
        // get sales total for month to show
        if (stockResult.length !== 0) {
          const totalPurchaseForThisMonth = stockResult.reduce(
            (sum, item) => sum + item.cost_per_unit * item.quantity,
            0
          );
          setHeadingDetails({
            count: stockResult.length.toString(),
            total: totalPurchaseForThisMonth.toString(),
          });
        } else {
          setHeadingDetails({
            count: "0",
            total: "0.00",
          });
        }
        setReportResultPurchase(stockResult);
      }
    } catch (error) {
      console.error("Error getting report data from the database:", error);
    }
  }, [
    db,
    setReportResultSale,
    setReportResultPurchase,
    yearValue,
    monthValue,
    reportTypeValue,
  ]);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", getReportData);

    getReportData();

    return () => {
      focusListener(); // Unsubscribe the listener
    };
  }, [db, navigation, getReportData, yearValue, monthValue, reportTypeValue]);
  // Ends here: query for Reports

  return (
    <View style={styles.mainContainer}>
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
      <ScrollView
        contentContainerStyle={{
          padding: 15,
          paddingVertical: 10,
          flex: 1,
        }}
      >
        <ResultInfo headingFor={headingFor} headingDetails={headingDetails} />
        {reportTypeValue === "Sales" ? (
          <SalesList allitems={reportResultSale} navigation={navigation} />
        ) : (
          <StocksList
            allStocks={reportResultPurchase}
            navigation={navigation}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dropDownContainer: {
    width: "95%",
    marginVertical: 10,
    marginHorizontal: 10,
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
  resultInfoContainer: {
    marginBottom: 12,
    backgroundColor: theme.colors.secondary,
    //paddingBottom: 7,
    // Add other container styles as necessary
  },
  resultInfoHeading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.colors.heading,
    textDecorationLine: "underline",
  },
  resultInfoDetails: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#f2f2f2",
  },
});

export default Reports;
