import React, { useContext, useState } from "react";
import { AuthContext, AuthProvider } from "./AuthContext";
import webSocketService from "./WebSocketService";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import ViewResults from "./Results"; // Import the ViewResults component
import "./App.css"; // CSS for styling

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register
  const [showViewResults, setShowViewResults] = useState(false); // State to toggle View Results page

  if (user) {
    const email = localStorage.getItem("email")
    webSocketService.send({ command: "set_user",email: email })
    return <Dashboard />;
  }

  // Render ViewResults if the "View Results" button is clicked
  if (showViewResults) {
    return <ViewResults onBack={() => setShowViewResults(false)} />;
  }

  return (
    <div className={`container ${isLogin ? "show-login" : "show-register"}`}>
      <div className="form-container">
        {isLogin ? (
          <LoginPage
            onLoggedIn={() => window.location.reload()}
            onViewResults={() => setShowViewResults(true)} // Pass handler for "View Results"
          />
        ) : (
          <RegistrationPage onRegistered={() => setIsLogin(true)} />
        )}
      </div>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
      <p>
        <button
          className="view-results-btn"
          onClick={() => setShowViewResults(true)} // Correctly use setShowViewResults
        >
          View Results
        </button>
      </p>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
