import { configureStore } from "@reduxjs/toolkit";
import { itemsSlice } from "./items-slice";

configureStore({
  reducer: { items: itemsSlice.reducer },
});
