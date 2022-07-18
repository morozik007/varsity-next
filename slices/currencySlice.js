import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCurrency = createAsyncThunk(
  'currency/fetchCurrency',
  async (lang, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rest/${lang}/V1/directory/currency`
      );
      if (!response.ok) {
        throw new Error('Api error!');
      }
      const data = await response.json();
      const currencyName = data.base_currency_code;
      return currencyName;
    } catch (error) {
      return rejectWithValue(error.messsage);
    }
  }
);

const initialState = {
  name: '',
  status: null,
  error: null,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    //reducer to change the value
    // currencyAdded(state, action) {
    //   state.name = action.payload;
    // },
  },
  extraReducers: {
    [fetchCurrency.pending]: (state) => {
      state.status = 'currency loading';
      state.error = null;
    },
    [fetchCurrency.fulfilled]: (state, action) => {
      state.status = 'currency loaded';
      state.name = action.payload;
    },
    [fetchCurrency.rejected]: (state, action) => {
      state.status = 'Fail';
      state.error = action.payload;
    },
  },
});

export const getCurrency = (state) => state.currency;

//export const { currencyAdded } = currencySlice.actions;

export default currencySlice.reducer;
