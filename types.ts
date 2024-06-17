export interface Categories {
  id: number;
  name: string;
}
export interface Items {
  id: number;
  category_id: number;
  name: string;
}
export interface PaymentStatus {
  id: number;
  status: string;
}
export interface Sales {
  id: number;
  bill_no: number;
  item_id: number;
  sales_date_year: number;
  sales_date_month: number;
  sales_date_gatey: number;
  quantity: number;
  sales_total: number;
}
export interface Stocks {
  id: number;
  bill_no: number;
  item_id: number;
  purchase_date_year: number;
  purchase_date_month: number;
  purchase_date_gatey: number;
  quantity: number;
  cost_per_unit: number;
}

export interface TransactionsByMonth {
  totalExpenses: number;
  totalIncome: number;
  currentNepaliYear: string;
  currentNepaliMonth: string;
}

export type InStockListProps = {
  item_id: number;
  name: string;
  all_total_sales: number;
  all_total_stocks: number;
  total_quantity_remain_in_stock: number;
};

export type ItemsListProps = {
  category_id: number;
  category_name: String;
  id: number;
  name: string;
};
export type ItemsListAddProps = {
  category_id?: string;
  name?: string;
};
export type SalesListProps = {
  id: number;
  bill_no: number;
  item_id: number;
  sales_date_year: number;
  sales_date_month: number;
  sales_date_gatey: number;
  quantity: number;
  sales_total: number;
  item_name: string;
};
export type SalesListAddProps = {
  bill_no?: string;
  item_id?: string;
  sales_date_year?: string;
  sales_date_month?: string;
  sales_date_gatey?: string;
  quantity?: string;
  sales_total?: string;
};
export type StockListProps = {
  id: number;
  bill_no: number;
  item_id: number;
  purchase_date_year: number;
  purchase_date_month: number;
  purchase_date_gatey: number;
  quantity: number;
  cost_per_unit: number;
  item_name: string;
};
export type StockListAddProps = {
  bill_no?: string;
  item_id?: string;
  purchase_date_year?: string;
  purchase_date_month?: string;
  purchase_date_gatey?: string;
  quantity?: string;
  cost_per_unit?: string;
};

export interface SalesItem {
  id: number;
  item_id: number;
  item_name: string;
  sales_date_year: number;
  sales_date_month: number;
  quantity: number;
  price: number;
  sales: number; // Defined the type for the sales column
  type: string;
  total_sales_for_this_month: number; // Added the type for the _for_this_month column
}

export interface PurchaseItem {
  id: number;
  item_id: number;
  item_name: string;
  purchase_date_year: number;
  purchase_date_month: number;
  quantity: number;
  price: number;
  stocks: number; // Defined the type for the stocks column
  type: string;
  total_purchase_for_this_month: number; // Added the type for the total_purchase_for_this_month column
}
