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
  item_id: number;
  quantity: number;
  sales_total: number;
  sales_status: number;
  customer_name: string | null;
}
export interface Stocks {
  id: number;
  item_id: number;
  quantity: number;
  cost_per_unit: number;
  payment_status: number;
  supplier_name: string | null;
}

export interface TransactionsByMonth {
  totalExpenses: number;
  totalIncome: number;
}

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
