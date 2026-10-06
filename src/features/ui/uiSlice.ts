import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  /** Desktop sidebar collapsed to icons only. */
  sidebarCollapsed: boolean;
  /** Mobile drawer visibility. */
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileNavOpen: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    sidebarToggled(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    mobileNavOpened(state) {
      state.mobileNavOpen = true;
    },
    mobileNavClosed(state) {
      state.mobileNavOpen = false;
    }
  }
});

export const { sidebarToggled, mobileNavOpened, mobileNavClosed } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;