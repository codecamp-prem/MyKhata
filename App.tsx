import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import Loading from "./components/Loading";
import AddCategory from "./screens/AddCategory";
import AddItems from "./screens/AddItems";
import AddSales from "./screens/AddSales";
import Category from "./screens/Category";
import EditDeleteSales from "./screens/EditDeleteSales";
import Home from "./screens/Home";
import Items from "./screens/Items";
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
              name="Home"
              component={Home}
              options={{ headerTitle: "MyKhata-Home", headerLargeTitle: true }}
            />
            <Stack.Screen
              name="Category"
              component={Category}
              options={{
                headerTitle: "MyKhata-Category",
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="AddCategory"
              component={AddCategory}
              options={{
                headerTitle: "MyKhata- Add Category",
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
