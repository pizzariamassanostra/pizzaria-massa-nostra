import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CommonUserState {
  name: string;
  phone: string;
}

export const commonUser = createSlice({
  name: "commonUser",
  initialState: (typeof window !== "undefined"
    ? localStorage.getItem("common-user")
      ? {
          ...(JSON.parse(
            localStorage.getItem("common-user") as string,
          ) as CommonUserState),
        }
      : null
    : { name: "", phone: "" }) as CommonUserState | null,
  reducers: {
    setCommonUserData: (_state, action: PayloadAction<CommonUserState>) => {
      _state = action.payload;
      localStorage.setItem("common-user", JSON.stringify(action.payload));
      return action.payload;
    },

    clearCommonUserData: () => {
      localStorage.removeItem("common-user");
      return null;
    },
  },
});

export const { setCommonUserData, clearCommonUserData } = commonUser.actions;

export default commonUser.reducer;
