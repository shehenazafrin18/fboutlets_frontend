import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";
import swal from "sweetalert";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : [],
  logoutSignal: null,
};
const COMPANY_ID = process.env.REACT_APP_COMPANY_ID;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userInfo, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        userInfo,
        {
          headers: {
            "Content-Type": "application/json",
            // "COMPANY_ID": COMPANY_ID
          },
        },
      );
      // console.log({ data });
      // return false;
      const userData = jwtDecode(data?.data?.access_token);
      console.log({ userData });

      if (userData) {
        const user = {
          ...data?.data,
          data: userData,
          // company: data.data.data,
          // language: data.data.data.lang_data,
        };
        return user;
      } else {
        swal({
          title: "Invalid Login",
          icon: "error",
        });
      }
      // return data.data;
    } catch (error) {
      swal({
        // title: error.response.data.message,
        title: "Invalid email or password!!",
        icon: "warning",
      });
      return rejectWithValue(error.response.data.message);
    }
  },
);
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (userInfo, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/hr_login`,
        userInfo,
        {
          headers: {
            "Content-Type": "application/json",
            COMPANY_ID: COMPANY_ID,
          },
        },
      );
      const userData = jwtDecode(data.data.access_token);

      if (userData) {
        const user = {
          ...data.data,
          data: userData,
        };
        return user;
      } else {
        swal({
          title: "Invalid Login",
          icon: "error",
        });
      }
    } catch (error) {
      console.log({ error });
      swal({
        title: error.response.data.message,
        icon: "error",
      });
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changePhoto: (state, action) => {
      state.user = {
        ...state.user,
        data: {
          ...state.user?.data?.data,
          profile_image: action.payload.profile_image,
          full_name: action.payload.full_name,
          email: action.payload.email,
          contact_number: action.payload.contact_number,
        },
      };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = [];
      state.logoutSignal = Date.now().toString();
      localStorage.clear();
      localStorage.setItem("logoutSignal", state.logoutSignal);
      localStorage.setItem("user", []);
    },
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.loginSignal = Date.now().toString();
      localStorage.setItem("loginSignal", state.loginSignal);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    [loginUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [loginAdmin.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [loginAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(state.user));
    },
    [loginAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changePhoto, logout } = authSlice.actions;

export default authSlice.reducer;
