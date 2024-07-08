import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Categories } from "../types";

class ItemsRepository {
  private db: SQLiteDatabase;

  constructor() {
    this.db = useSQLiteContext();
  }

  async getCategoryData(): Promise<{ label: string; value: string }[]> {
    const result = await this.db.getAllAsync<Categories>(
      `SELECT * FROM Categories`
    );
    return result.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }));
  }

  async addItem(categoryId: number, name: string): Promise<void> {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(
        `
          INSERT INTO Items (
            category_id,
            name
          )
          VALUES (?, ?);
        `,
        [categoryId, name]
      );
    });
  }
}

export default ItemsRepository;
