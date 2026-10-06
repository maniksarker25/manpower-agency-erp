import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { baseApi } from '../app/store/api/baseApi';
import { loggedOut } from '../features/auth/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  const logout = useCallback(() => {
    dispatch(loggedOut());
    dispatch(baseApi.util.resetApiState());
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  return { user, token, isAuthenticated: Boolean(token), logout };
}