import { createSlice } from '@reduxjs/toolkit';

// Read persisted value from localStorage
const savedDark = localStorage.getItem('darkMode') === 'true';
// Apply immediately so there's no flash on load
document.documentElement.classList.toggle('dark', savedDark);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    darkMode: savedDark,
    modal: { open: false, type: null, data: null },
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebar: (state, action) => { state.sidebarOpen = action.payload; },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Sync to HTML class and persist
      document.documentElement.classList.toggle('dark', state.darkMode);
      localStorage.setItem('darkMode', String(state.darkMode));
    },
    openModal: (state, action) => { state.modal = { open: true, type: action.payload.type, data: action.payload.data || null }; },
    closeModal: (state) => { state.modal = { open: false, type: null, data: null }; },
  },
});

export const { toggleSidebar, setSidebar, toggleDarkMode, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
