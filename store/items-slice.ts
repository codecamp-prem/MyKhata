import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ItemsListProps } from "../types";

type ItemsState = {
  items: ItemsListProps[];
};
const initialState: ItemsState = {
  items: [],
};
export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItems(
      state,
      action: PayloadAction<{ category_id: string; name: string }>
    ) {},
  },
});
