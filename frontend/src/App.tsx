import React, { useState, useEffect } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import ResponsiveAppBar from "./components/generics/AppBar";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "./route/GamePage";
import { Profile } from "./route/Profile";
import HomeProtect from "./components/auth/HomeProtect";
import RouteProtect from "./components/auth/RouteProtect";
import { VisitorProfile } from "./route/VisitorProfile";
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { Websocket } from './components/chat/Websocket';

export const UserContext = React.createContext<UserDto | null>(null);
export const SetUserContext = React.createContext<any>(null);

function App() {
  React.useState("Homepage");

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

  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const resp = await UserAPI.getUserProfile();
      setUser(resp);

      const logged = await UserAPI.isLoggedIn();
      setLoggedIn(logged.loggedIn);
    };
    
    fetchProfile();
  }, []);

  // React.useEffect(() => {
  //   const isLoggedIn = async () => {
  //     const logged = await UserAPI.isLoggedIn();
  //     setLoggedIn(logged.loggedIn);
  //   };

  //   isLoggedIn();
  // }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={user}>
        <SetUserContext.Provider value={setUser}>
          <CssBaseline />
          <div className="App">
            <ResponsiveAppBar handleToggle={handleToggle} setLoggedIn={setLoggedIn} />

            <Routes>
              <Route
                path="/"
                element={
                  <HomeProtect loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
                    <Homepage />
                  </HomeProtect>
                }
              />
              <Route
                path="/profile"
                element={
                  <RouteProtect>
                    <Profile />
                  </RouteProtect>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <RouteProtect>
                    <VisitorProfile />
                  </RouteProtect>
                }
              />
              <Route
                path="/chat"
                element={
                  <RouteProtect>
                    <WebsocketProvider value={socket}>
      <Websocket />
    </WebsocketProvider>
                  </RouteProtect>
                }
              />
            </Routes>
          </div>
        </SetUserContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
