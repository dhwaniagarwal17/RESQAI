import { createContext, useContext, useEffect, useState } from "react";
import { authApi, TOKEN } from "../services/api";

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!localStorage.getItem(TOKEN));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN)) return;
    authApi.me().then(setUser).catch(() => localStorage.removeItem(TOKEN)).finally(() => setReady(true));
  }, []);

  const sign = (fn) => async (body) => {
    const { user, token } = await fn(body);
    localStorage.setItem(TOKEN, token);
    setUser(user);
  };
  const logout = () => { localStorage.removeItem(TOKEN); setUser(null); };

  return <Ctx.Provider value={{ user, ready, logout, login: sign(authApi.login), register: sign(authApi.register) }}>{children}</Ctx.Provider>;
}
