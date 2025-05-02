import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { getTopEarningsForWeek, Earnings } from '../../utils';
const { REACT_APP_API_BASE_URL, REACT_APP_TOKEN } = process.env;

export interface EarningState {
  topEarningsByDay: {};
  logos: { [key: string]: { mark_vector_dark: string; mark_vector_light: string } };
  loading: boolean;
  error: string | null;
}

const initialState: EarningState = {
  topEarningsByDay: {},
  loading: false,
  logos: {},
  error: null,
};

export const getLatestEarnings = createAsyncThunk(
  'earnings/getLatestEarnings',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const today = moment().format('YYYY-MM-DD');
      const { data }: { data: { earnings: Earnings[] } } = await axios.get(
        `${REACT_APP_API_BASE_URL}/v2.1/calendar/earnings?token=${REACT_APP_TOKEN}&parameters%5Bdate_to%5D=${today}&parameters%5Bdate_sort%5D=date&pagesize=1000`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const topEarningsByDay = getTopEarningsForWeek(data?.earnings);
      const earnings = Object.values(topEarningsByDay).flatMap((day) => [
        ...day.BMO.map((item) => item.ticker),
        ...day.AMC.map((item) => item.ticker),
      ]);
      const logos = await dispatch(fetchLogos(earnings)).unwrap();
      return {
        topEarningsByDay,
        logos,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLogos = createAsyncThunk(
  'earnings/fetchLogos',
  async (tickers: string[], { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${REACT_APP_API_BASE_URL}/v2/logos/search?token=${REACT_APP_TOKEN}&search_keys_type=symbol${tickers
          .map((ticker) => `&search_keys=${ticker}`)
          .join('')}&fields=mark_vector_light`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const result = data.data.reduce(
        (
          acc: Record<string, { mark_vector_dark: string; mark_vector_light: string }>,
          item: { search_key: string; files: { mark_vector_dark: string; mark_vector_light: string } }
        ) => {
          acc[item.search_key] = {
            mark_vector_dark: item.files.mark_vector_dark,
            mark_vector_light: item.files.mark_vector_light,
          };
          return acc;
        },
        {}
      );
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLatestEarnings.pending, (state) => {
        state.topEarningsByDay = {};
        state.logos = {};
        state.loading = true;
        state.error = null;
      })
      .addCase(getLatestEarnings.fulfilled, (state, action) => {
        state.topEarningsByDay = action.payload.topEarningsByDay;
        state.logos = action.payload.logos;
        state.loading = false;
        state.error = null;
      })
      .addCase(getLatestEarnings.rejected, (state, action) => {
        const errorMessage = (action.payload as { message: string })?.message || 'Something went wrong';
        state.topEarningsByDay = {};
        state.logos = {};
        state.loading = false;
        state.error = errorMessage;
      });
  },
});

export default earningsSlice.reducer;
