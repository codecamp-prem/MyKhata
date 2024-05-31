import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

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

  if (!dbLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Suspense>
      <SQLiteProvider
        databaseName="MyKhataAppSqlite.db"
        useSuspense
      ></SQLiteProvider>
    </Suspense>
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
