import { useSQLiteContext } from "expo-sqlite";
import { Items, StockListAddProps, Stocks } from "../types";

export interface PurchaseData {
  bill_no: string;
  item_id: string;
  purchase_date_year: string;
  purchase_date_month: string;
  purchase_date_gatey: string;
  quantity: string;
  cost_per_unit: string;
}

class PurchaseRepository {
  private db: ReturnType<typeof useSQLiteContext>;

  constructor() {
    this.db = useSQLiteContext();
  }

  async getItemData(): Promise<{ label: string; value: string }[]> {
    const result = await this.db.getAllAsync<Items>(`SELECT * FROM Items`);
    return result.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }));
  }

  validate(purchaseData: PurchaseData): StockListAddProps | undefined {
    let isValid = true;
    const errors: StockListAddProps = {};

    if (!purchaseData.cost_per_unit.trim()) {
      errors.cost_per_unit = "Cost Per Unit is required";
      isValid = false;
    }
    if (!purchaseData.quantity.trim()) {
      errors.quantity = "Item Quantity is required";
      isValid = false;
    }
    if (!purchaseData.item_id.trim()) {
      errors.item_id = "Item is required";
      isValid = false;
    }
    if (!purchaseData.bill_no.trim()) {
      errors.bill_no = "Purchase Bill No. is required";
      isValid = false;
    }

    return isValid ? undefined : errors;
  }

  async addStock(purchaseData: PurchaseData): Promise<void> {
    const errors = this.validate(purchaseData);
    if (errors) {
      throw new Error(JSON.stringify(errors));
    }
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(
        `
            INSERT INTO Stocks (
              bill_no,
              item_id,
              purchase_date_year,
              purchase_date_month,
              purchase_date_gatey,
              quantity,
              cost_per_unit
            )
            VALUES (?, ?, ?, ?, ?, ?, ?);
          `,
        [
          purchaseData.bill_no,
          purchaseData.item_id,
          purchaseData.purchase_date_year,
          purchaseData.purchase_date_month,
          purchaseData.purchase_date_gatey,
          purchaseData.quantity,
          purchaseData.cost_per_unit,
        ]
      );
    });
  }

  async getPurchaseDetailsById(
    param_salesId: number
  ): Promise<Stocks | undefined> {
    const purchase_details_from_id = await this.db.getAllAsync<Stocks>(
      `SELECT * FROM Stocks WHERE id = ?`,
      param_salesId
    );
    return purchase_details_from_id.length > 0
      ? purchase_details_from_id[0]
      : undefined;
  }

  async updatePurchase(
    param_stockId: number,
    bill_no: string,
    item_id: string,
    quantity: string,
    cost_per_unit: string
  ): Promise<void> {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(
        `
            UPDATE Stocks
            SET
              bill_no = ?,
              item_id = ?,
              quantity = ?,
              cost_per_unit = ?
            WHERE id = ?;
          `,
        [bill_no, item_id, quantity, cost_per_unit, param_stockId]
      );
    });
  }

  async updateStock(stock: Stocks) {
    try {
      await this.db.withTransactionAsync(async () => {
        await this.db.runAsync(
          `
            UPDATE Stocks
            SET bill_no = ?,
                item_id = ?,
                purchase_date_year = ?,
                purchase_date_month = ?,
                purchase_date_gatey = ?,
                quantity = ?,
                cost_per_unit = ?
            WHERE id = ?;
          `,
          [
            stock.bill_no,
            stock.item_id,
            stock.purchase_date_year,
            stock.purchase_date_month,
            stock.purchase_date_gatey,
            stock.quantity,
            stock.cost_per_unit,
            stock.id,
          ]
        );
      });
    } catch (error) {
      throw new Error("Unable to update stock. Please try again later.");
    }
  }

  async deleteStock(id: number): Promise<void> {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(`DELETE FROM Stocks WHERE id = ?;`, [id]);
    });
  }
}

export default PurchaseRepository;
