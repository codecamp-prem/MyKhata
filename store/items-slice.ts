import { createSlice } from "@reduxjs/toolkit";
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
    addItems() {},
    removeItem() {},
  },
});
