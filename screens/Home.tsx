import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextStyle } from "react-native";
import HomeScreenMenu from "../components/HomeScreenMenu";
import Card from "../components/ui/Card";
import { InStockListProps, TransactionsByMonth } from "../types";
import {
  getFullNepaliMonth,
  getNepaliMonth,
  getNepaliYear,
} from "../utils/nepaliDate";

export default function Home() {
  const navigation = useNavigation();
  const currentNepaliMonth = useRef(getNepaliMonth());
  const currentNepaliYear = useRef(getNepaliYear());

  const [transactionsByMonth, setTransactionsByMonth] =
    useState<TransactionsByMonth>({
      totalExpenses: 0,
      totalIncome: 0,
      currentNepaliYear: currentNepaliYear.current,
      currentNepaliMonth: currentNepaliMonth.current,
    });

  const [stockStatus, setStockStatus] = useState<InStockListProps[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
    navigation.addListener("focus", async () => {
      await getData();
    });
  }, [db, navigation]);

  async function getData() {
    try {
      //console.log(getMonthStartEndDates());
      let total_cost_of_cur_month = 0;
      let total_sales_of_cur_month = 0;
      const firstDayCurrentMonth = 1;
      const lastDayCurrentMonth = 32;

      // Get Stocks Total for this month
      const query = `
        SELECT SUM(cost_per_unit * quantity) as total_cost
        FROM Stocks
        WHERE purchase_date_year = ? AND purchase_date_month = ? AND purchase_date_gatey BETWEEN ? AND ?
      `;
      const stocks = await db.getAllAsync<any>(query, [
        parseInt(currentNepaliYear.current),
        parseInt(currentNepaliMonth.current),
        firstDayCurrentMonth,
        lastDayCurrentMonth,
      ]);
      if (stocks != null) {
        total_cost_of_cur_month = stocks[0].total_cost;
      }

      // Get Sales Total for this month
      const query1 = `
      SELECT SUM(sales_total) as total_sales
      FROM Sales
      WHERE sales_date_year = ? AND sales_date_month = ? AND sales_date_gatey BETWEEN ? AND ?
    `;
      const sales = await db.getAllAsync<any>(query1, [
        parseInt(currentNepaliYear.current),
        parseInt(currentNepaliMonth.current),
        firstDayCurrentMonth,
        lastDayCurrentMonth,
      ]);

      if (sales != null) {
        total_sales_of_cur_month = sales[0].total_sales;
      }

      setTransactionsByMonth({
        totalExpenses: total_cost_of_cur_month,
        totalIncome: total_sales_of_cur_month,
        currentNepaliYear: currentNepaliYear.current,
        currentNepaliMonth: currentNepaliMonth.current,
      });

      const getStockStatusQuery = `SELECT i.id AS item_id,
      i.name,
      COALESCE(stock_data.quantity, 0) AS all_total_stocks,
      COALESCE(sales_data.quantity, 0) AS all_total_sales,
      COALESCE(stock_data.quantity, 0) - COALESCE(sales_data.quantity, 0) AS total_quantity_remain_in_stock
      FROM Items i
      LEFT JOIN (
        SELECT item_id, SUM(quantity) AS quantity
        FROM Stocks
        GROUP BY item_id
      ) AS stock_data ON i.id = stock_data.item_id
      LEFT JOIN (
        SELECT item_id, SUM(quantity) AS quantity
        FROM Sales
        GROUP BY item_id
      ) AS sales_data ON i.id = sales_data.item_id
      ORDER BY total_quantity_remain_in_stock ASC`;
      const stockStatusResult = await db.getAllAsync<any>(getStockStatusQuery);
      setStockStatus(stockStatusResult);
    } catch (error) {
      console.error("Error executing the database query:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 10, paddingVertical: 10 }}>
      <TransactionSummary
        totalExpenses={transactionsByMonth.totalExpenses}
        totalIncome={transactionsByMonth.totalIncome}
        currentNepaliYear={currentNepaliYear.current}
        currentNepaliMonth={currentNepaliMonth.current}
      />
      <HomeScreenMenu navigation={navigation} />
      <StockSummary stockStatus={stockStatus} />
    </ScrollView>
  );
}

function TransactionSummary({
  totalIncome,
  totalExpenses,
  currentNepaliYear,
  currentNepaliMonth,
}: TransactionsByMonth) {
  const savings = totalIncome - totalExpenses;

  const readablePeriod =
    getFullNepaliMonth(currentNepaliMonth) + ", " + currentNepaliYear;

  // Function to determine the style based on the value (positive or negative)
  const getMoneyTextStyle = (value: number): TextStyle => ({
    fontWeight: "bold",
    color: value < 0 ? "#ff4500" : "#2e8b57", // Red for negative, custom green for positive
  });

  // Helper function to format monetary values
  const formatMoney = (value: number) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? "-" : ""}रु${absValue}`;
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
      <Text style={styles.summaryText}>
        Income:{" "}
        <Text style={getMoneyTextStyle(totalIncome)}>
          {formatMoney(totalIncome)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Total Expenses:{" "}
        <Text style={getMoneyTextStyle(totalExpenses)}>
          {formatMoney(totalExpenses)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Savings:{" "}
        <Text style={getMoneyTextStyle(savings)}>{formatMoney(savings)}</Text>
      </Text>
    </Card>
  );
}

function StockSummary({ stockStatus }: { stockStatus: InStockListProps[] }) {
  // Function to determine the style based on the value (positive or negative)
  const getStockTextStyle = (value: number): TextStyle => ({
    fontWeight: "bold",
    color: value < 10 ? "#ff4500" : "#2e8b57", // Red for negative, custom green for positive
  });

  return (
    <Card style={styles.stockContainer}>
      <Text style={styles.stockTitle}>Total Item in Stock</Text>
      {stockStatus.map((item) => {
        return (
          <Text style={styles.summaryText} key={item.item_id}>
            <Text
              style={getStockTextStyle(item.total_quantity_remain_in_stock)}
            >
              {item.name}-{item.total_quantity_remain_in_stock}
            </Text>
          </Text>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingBottom: 7,
    // Add other container styles as necessary
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  summaryText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  stockContainer: {
    marginBottom: 10,
    paddingBottom: 7,
    // Add other container styles as necessary
  },
  stockTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
