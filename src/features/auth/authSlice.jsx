import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signUp, login, updateProfileService } from '../../services/userService';

// Define an async thunk for user registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
    const response = await signUp(userData);
    const user = response.data; // Assuming the response contains user data
    return user;
    });

    // Define an async thunk for user login
export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password}) => {
    const response = await login(username, password);
    const user = response.data; // Assuming the response contains user data
    return user;
    });


export const updateProfile = createAsyncThunk('auth/updateProfile', async (updatedData) => {
    const response = await updateProfileService(updatedData);
    return response.data;
    });

    const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false;
            state.user= null
            console.log(action.error.message)
            if(action.error.message=== "Request failed with status code 400"){
                state.error = "Access Denied! invalid Credentials"
            }
            else{
                state.error=action.error.message;
            }
        })
        .addCase(updateProfile.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        })
        .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        });
    },
});
export const {logoutUser} = authSlice.actions;
export default authSlice.reducer;
