import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import Loading from "./components/Loading";
import AddItems from "./screens/AddItems";
import AddSales from "./screens/AddSales";
import AddStocks from "./screens/AddStocks";
import EditDeleteSales from "./screens/EditDeleteSales";
import EditDeleteStocks from "./screens/EditDeleteStocks";
import Home from "./screens/Home";
import Items from "./screens/Items";
import LoginScreen from "./screens/LoginScreen";
import Purchase from "./screens/Purchase";
import Reports from "./screens/Reports";
import Sales from "./screens/Sales";

const Stack = createNativeStackNavigator();

const loadDatabase = async () => {
  const dbName = "MyKhataAppSqlite.db";
  const dbAsset = require("./assets/MyKhataAppSqlite.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded) return <Loading />;

  return (
    <NavigationContainer>
      <Suspense fallback={<Loading />}>
        <SQLiteProvider databaseName="MyKhataAppSqlite.db" useSuspense>
          <Stack.Navigator>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                headerTitle: "MyKhata-Login",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerTitle: "MyKhata-Home", headerLargeTitle: true }}
            />
            <Stack.Screen
              name="Reports"
              component={Reports}
              options={{
                headerTitle: "MyKhata-Reports",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="Items"
              component={Items}
              options={{
                headerTitle: "MyKhata-Items",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="AddItems"
              component={AddItems}
              options={{
                headerTitle: "MyKhata- Add Items",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="Sales"
              component={Sales}
              options={{
                headerTitle: "MyKhata-Sales",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="AddSales"
              component={AddSales}
              options={{
                headerTitle: "MyKhata- Add Sales",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="EditDeleteSales"
              component={EditDeleteSales}
              options={{
                headerTitle: "MyKhata- Edit/Delete Sales",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="Stocks"
              component={Purchase}
              options={{
                headerTitle: "MyKhata-Purchase",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="AddStocks"
              component={AddStocks}
              options={{
                headerTitle: "MyKhata- Add Purchase",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="EditDeleteStocks"
              component={EditDeleteStocks}
              options={{
                headerTitle: "MyKhata- Edit/Delete Purchase",
                headerLargeTitle: true,
              }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
      </Suspense>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
