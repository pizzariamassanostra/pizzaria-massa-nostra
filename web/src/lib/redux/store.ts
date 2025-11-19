import { configureStore } from "@reduxjs/toolkit";
import commonUserReducer from "./reducers/common-user.reducer";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: { commonUserReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
