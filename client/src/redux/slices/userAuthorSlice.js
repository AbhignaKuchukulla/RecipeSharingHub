import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; 

// Make HTTP request using redux-thunk middleware
export const userAuthorLoginThunk = createAsyncThunk(
  "user-author-admin-login",
  async (userCredObj, thunkApi) => {
    try {
      let url;
      if (userCredObj.userType === "user") {
        url = "http://localhost:4000/user-api/login";
      } else if (userCredObj.userType === "author") {
        url = "http://localhost:4000/author-api/login";
      } else if (userCredObj.userType === "admin") {
        url = "http://localhost:4000/admin-api/login";
      } else {
        return thunkApi.rejectWithValue("Invalid user type");
      }

      const res = await axios.post(url, userCredObj);
      if (res.data.message === "login success") {
        // Store token in local/session storage
        localStorage.setItem("token", res.data.token);
        // Return data
        return res.data;
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      return thunkApi.rejectWithValue(err.message || err);
    }
  }
);

export const userAuthorAdminSlice = createSlice({
  name: "user-author-admin-login",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: {},
    errorOccurred: false,
    errMsg: '',
  },
  reducers: {
    resetState: (state, action) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccurred = false;
      state.errMsg = '';
    }
  },
  extraReducers: builder => builder
    .addCase(userAuthorLoginThunk.pending, (state, action) => {
      state.isPending = true;
    })
    .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
      state.isPending = false;
      state.currentUser = action.payload.user;
      state.loginUserStatus = true;
      state.errMsg = '';
      state.errorOccurred = false;
    })
    .addCase(userAuthorLoginThunk.rejected, (state, action) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errMsg = action.payload;
      state.errorOccurred = true;
    }),
});

// Export action creator functions
export const { resetState } = userAuthorAdminSlice.actions;
// Export root reducer of this slice
export default userAuthorAdminSlice.reducer;
