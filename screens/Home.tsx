import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextStyle } from "react-native";
import HomeScreenMenu from "../components/HomeScreenMenu";
import Card from "../components/ui/Card";
import { TransactionsByMonth } from "../types";
import { getNepaliMonth, getNepaliYear } from "../utils/nepaliDate";

export default function Home() {
  const navigation = useNavigation();
  const [transactionsByMonth, setTransactionsByMonth] =
    useState<TransactionsByMonth>({
      totalExpenses: 0,
      totalIncome: 0,
    });

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
      const currentNepaliMonth = getNepaliMonth();
      const currentNepaliYear = getNepaliYear();

      // Get Stocks Total for this month
      const query = `
        SELECT SUM(cost_per_unit * quantity) as total_cost
        FROM Stocks
        WHERE purchase_date_year = ? AND purchase_date_month = ? AND purchase_date_gatey BETWEEN ? AND ?
      `;
      const stocks = await db.getAllAsync<any>(query, [
        parseInt(currentNepaliYear),
        parseInt(currentNepaliMonth),
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
        parseInt(currentNepaliYear),
        parseInt(currentNepaliMonth),
        firstDayCurrentMonth,
        lastDayCurrentMonth,
      ]);

      if (sales != null) {
        total_sales_of_cur_month = sales[0].total_sales;
      }
      setTransactionsByMonth({
        totalExpenses: total_cost_of_cur_month,
        totalIncome: total_sales_of_cur_month,
      });
    } catch (error) {
      console.error("Error executing the database query:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 10, paddingVertical: 10 }}>
      <TransactionSummary
        totalExpenses={transactionsByMonth.totalExpenses}
        totalIncome={transactionsByMonth.totalIncome}
      />
      <HomeScreenMenu navigation={navigation} />
    </ScrollView>
  );
}

function TransactionSummary({
  totalIncome,
  totalExpenses,
}: TransactionsByMonth) {
  const savings = totalIncome - totalExpenses;
  const readablePeriod = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

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
  },
  summaryText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
});
