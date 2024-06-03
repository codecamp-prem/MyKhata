import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextStyle } from "react-native";
import HomeScreenMenu from "../components/HomeScreenMenu";
import Card from "../components/ui/Card";
import { TransactionsByMonth } from "../types";

export default function Home({ navigation }: { navigation: any }) {
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
  }, [db]);

  async function getData() {
    try {
      console.log(getMonthStartEndDates());
      // const query = `SELECT SUM(cost_per_unit * quantity) AS total_cost FROM Stocks WHERE billed_date BETWEEN '${
      //   getMonthStartEndDates().startDate
      // }' AND '${getMonthStartEndDates().endDate}'`;
      const { startDate, endDate } = getMonthStartEndDates();
      const query = `
    SELECT *
    FROM Stocks
    WHERE billed_date BETWEEN ? AND ?
  `;
      const stocks = await db.getAllAsync<any>(query, [startDate, endDate]);
      console.log(stocks);
    } catch (error) {
      console.error("Error executing the database query:", error);
    }
    // setTransactionsByMonth(stocks_bill, );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 10, paddingVertical: 10 }}>
      <TransactionSummary totalExpenses={100} totalIncome={200} />
      <HomeScreenMenu navigation={navigation} />
    </ScrollView>
  );
}
function getMonthStartEndDates() {
  // Get the current date
  const currentDate = new Date();

  // Get the start of the current month
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const startDateString = startDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Get the end of the current month
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const endDateString = endDate.toISOString().slice(0, 19).replace("T", " ");

  return {
    startDate: startDateString,
    endDate: endDateString,
  };
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
    return `${value < 0 ? "-" : ""}$${absValue}`;
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
