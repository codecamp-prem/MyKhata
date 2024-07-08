import { useSQLiteContext } from "expo-sqlite";
import { Items, Sales, SalesListAddProps } from "../types";

export interface SalesData {
  bill_no: string;
  item_id: string;
  sales_date_year: string;
  sales_date_month: string;
  sales_date_gatey: string;
  quantity: string;
  sales_total: string;
}

class SalesRepository {
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

  validate(salesData: SalesData): SalesListAddProps | undefined {
    let isValid = true;
    const errors: SalesListAddProps = {};

    if (!salesData.sales_total.trim()) {
      errors.sales_total = "Sales total is required";
      isValid = false;
    }

    if (!salesData.quantity.trim()) {
      errors.quantity = "Item Quantity is required";
      isValid = false;
    }

    if (!salesData.item_id.trim()) {
      errors.item_id = "Item is required";
      isValid = false;
    }

    if (!salesData.bill_no.trim()) {
      errors.bill_no = "Bill no. is required";
      isValid = false;
    }

    return isValid ? undefined : errors;
  }

  async addSales(salesData: SalesData): Promise<void> {
    const errors = this.validate(salesData);
    if (errors) {
      throw new Error(JSON.stringify(errors));
    }

    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(
        `
          INSERT INTO Sales (
            bill_no,
            item_id,
            sales_date_year,
            sales_date_month,
            sales_date_gatey,
            quantity,
            sales_total
          )
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [
          salesData.bill_no,
          salesData.item_id,
          salesData.sales_date_year,
          salesData.sales_date_month,
          salesData.sales_date_gatey,
          salesData.quantity,
          salesData.sales_total,
        ]
      );
    });
  }

  async getSalesDetailsById(param_salesId: number): Promise<Sales | undefined> {
    const sales_details_from_id = await this.db.getAllAsync<Sales>(
      `SELECT * FROM Sales WHERE id = ?`,
      param_salesId
    );
    return sales_details_from_id.length > 0
      ? sales_details_from_id[0]
      : undefined;
  }

  async updateSales(
    param_salesId: number,
    bill_no: string,
    item_id: string,
    quantity: string,
    sales_total: string
  ): Promise<void> {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(
        `
          UPDATE Sales
          SET
            bill_no = ?,
            item_id = ?,
            quantity = ?,
            sales_total = ?
          WHERE id = ?;
        `,
        [bill_no, item_id, quantity, sales_total, param_salesId]
      );
    });
  }

  async deleteSales(id: number): Promise<void> {
    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(`DELETE FROM Sales WHERE id = ?;`, [id]);
    });
  }
}

export default SalesRepository;
