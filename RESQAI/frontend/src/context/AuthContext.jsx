import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, role = "reporter") => {
    const names = {
      reporter: "Asha (reporter)",
      admin: "Rajan (admin)",
      rescue: "Team Alpha (rescue team)"
    };
    setUser({ email, role, name: names[role] || names.reporter });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}