import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await axios.get('/notifications');
  return data;
});

export const markRead = createAsyncThunk('notifications/markRead', async (id) => {
  await axios.put(`/notifications/${id}/read`);
  return id;
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async () => {
  await axios.put('/notifications/read-all');
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(markRead.fulfilled, (state, action) => {
        const n = state.items.find(i => i._id === action.payload);
        if (n) n.isRead = true;
      })
      .addCase(markAllRead.fulfilled, (state) => { state.items.forEach(n => n.isRead = true); });
  },
});

export default notificationSlice.reducer;
