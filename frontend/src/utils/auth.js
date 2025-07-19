// src/utils/auth.js
import {jwtDecode} from 'jwt-decode';

const TOKEN_KEY = 'attendance_app_token';

export const setToken = (token) =>
  localStorage.setItem(TOKEN_KEY, token);

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY);

export const clearToken = () =>
  localStorage.removeItem(TOKEN_KEY);

export const getUserRole = () => {
  try {
    const token = getToken();
    if (!token) return null;
    const { role } = jwtDecode(token);
    return role; 
  } catch {
    return null;
  }
};
