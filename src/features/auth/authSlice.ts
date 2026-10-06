import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserAccount } from '../../types/models';

const STORAGE_KEY = 'meridian.auth';

interface AuthState {
  token: string | null;
  user: UserAccount | null;
}

function readPersisted(): AuthState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {

    /* ignore storage failures */}
  return { token: null, user: null };
}

function persist(state: AuthState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {

    /* ignore storage failures */}
}

const initialState: AuthState = readPersisted();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsReceived(state, action: PayloadAction<{token: string;user: UserAccount;}>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      persist(state);
    },
    profileUpdated(state, action: PayloadAction<Partial<UserAccount>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      persist(state);
    },
    loggedOut(state) {
      state.token = null;
      state.user = null;
      persist(state);
    }
  }
});

export const { credentialsReceived, profileUpdated, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
export type { AuthState };