import React, { useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import ResponsiveAppBar from "./components/AppBar";
import { RouteHandler } from "./components/RouteHandler";

function App() {

  // Route handler
  const [route, setRoute] = React.useState('Homepage');

  // Dark/ligh mode
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleToggle = () => {
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
    <CssBaseline />
    <div className="App">
      <ResponsiveAppBar
        handleToggle={handleToggle}
        user={user}
        setUser={setUser}
        setRoute={setRoute}
      />
      <RouteHandler 
        handleToggle={handleToggle}
        user={user}
        setUser={setUser}
        route={route}
        setRoute={setRoute}
      />
    </div>
    </ThemeProvider>
  );
}

export default App;
