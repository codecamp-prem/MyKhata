// ItemsRepository.ts
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Categories, ItemsListProps } from "../types";

class ItemsRepository {
  private db: SQLiteDatabase;

  constructor() {
    this.db = useSQLiteContext();
  }

  async getItemsData(): Promise<ItemsListProps[]> {
    return await this.db.getAllAsync<ItemsListProps>(`
      SELECT i.*, c.name as category_name
      FROM Items i
      JOIN Categories c ON i.category_id = c.id
    `);
  }

  async deleteItem(id: number): Promise<void> {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(`DELETE FROM Items WHERE id = ?;`, [id]);
    });
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
