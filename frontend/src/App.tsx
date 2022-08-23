import React, { useState, useEffect } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import ResponsiveAppBar from "./components/AppBar";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "./route/Homepage";
import { Profile } from "./route/Profile";

export const UserContext = React.createContext<UserDto | null>(null);
export const SetUserContext = React.createContext<any>(null);

function App() {
  
  React.useState('Homepage');
	
	/* Dark/light mode */
  const [darkMode, setDarkMode] = useState(false);
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  
  useEffect(() => {
    const themeType = localStorage.getItem("dark") || "dark";
    if (themeType === "dark") {
      setDarkMode(true);
    }
  }, []);
  
  const handleToggle = () => {
    localStorage.setItem("dark", darkMode ? "light" : "dark");
    setDarkMode(!darkMode);
  };
  
  // Check if user is logged and retrieve profile
  const [user, setUser] = React.useState<UserDto | null>(null);
  
  React.useEffect(() => {
    const fetchProfile = async () => {
      const data = await UserAPI.getUserProfile();
      setUser(data);
    }

    fetchProfile();
  }, [])

  return (
    <ThemeProvider theme={theme}>
    <UserContext.Provider value={user}>
    <SetUserContext.Provider value={setUser}>
    <CssBaseline />
    <div className="App">

      <ResponsiveAppBar
        handleToggle={handleToggle}
        />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </div>
    </SetUserContext.Provider>
    </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
