import React, { createContext, useState, useEffect } from "react";
import webSocketService from "./WebSocketService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Assuming token validation happens here or on dashboard load
      setUser({ email: "example@example.com" }); // Mock user for now
    }
  }, [token]);

  const register = (email, password, callback) => {
    webSocketService.send({
      command: "register",
      email,
      password,
    });

    webSocketService.onMessage((data) => {
      if (data.command === "register_response" && data.status) {
        callback(true);
      } else {
        callback(false);
      }
    });
  };

  const login = (email, password, callback) => {
    webSocketService.send({
      command: "login",
      email,
      password,
    });

    webSocketService.onMessage((data) => {
      if (data.command === "login_response" && data.status) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        setUser({ email });
        callback(true);
      } else {
        callback(false);
      }
    });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
