"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';  // Import useRouter from Next.js for navigation

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Button,
  Card,
  CardContent,
  Typography,
  Switch,
  Box,
  Container,
  Grid,
} from "@mui/material";

// Toggle theme logic
const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const navigateToPortfolio = () => {
    router.push('/portfolio');  // Navigate to the PortfolioPage when button is clicked
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#3f51b5", // Luxurious blue for finance
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff", // Dark/Light mode backgrounds
      },
      text: {
        primary: darkMode ? "#fff" : "#333", // Light/Dark mode text
      },
    },
    typography: {
      fontFamily: '"Roboto", "Arial", sans-serif', // Set a modern font
      h3: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h6: {
        fontWeight: 400,
        fontSize: "1rem",
      },
      body2: {
        fontSize: "1rem",
        lineHeight: 1.6, // Increase line height for better readability
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px", // Sleek card corners
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Deeper shadow for modern look
            padding: "20px", // Increased card padding for better spacing
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)", // Slight scaling effect on hover
              boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.3)", // More prominent hover shadow
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px", // Sleek button corners
            padding: "10px 20px", // Adjust button size
            textTransform: "none", // Preserve text casing
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Smooth button shadow
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#2c387e", // Darker shade on hover
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          background: darkMode
            ? "linear-gradient(135deg, #2c387e, #1d1d1d)"
            : "linear-gradient(135deg, #3f51b5, #ffffff)", // Dynamic gradient background
          height: "100vh", // Full height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: "20px",
        }}
      >
        <Container maxWidth="lg" sx={{ zIndex: 1 }}>
          {/* Dark/Light Mode Toggle */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
            <Typography variant="body2" component="span" sx={{ marginLeft: "10px" }}>
              Toggle Dark/Light Mode
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{ textAlign: "center", padding: "20px" }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Time Series Forecasting & Portfolio Optimization
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              Welcome to a cutting-edge platform designed to help you make smarter investment decisions. 
              With our suite of powerful tools, you can seamlessly integrate advanced predictive models 
              and analytics into your portfolio management strategy. Whether you're an experienced investor 
              or just getting started, our platform offers the insights needed to optimize your investments, 
              reduce risks, and improve overall performance.
            </Typography>
           

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Portfolio Optimization
                    </Typography>
                    <Typography variant="body2" color="textSecondary"  paragraph>
                      Optimize your investment portfolio with advanced techniques and real-time data, 
                      ensuring that your investments are always aligned with your financial goals and risk tolerance.
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth onClick={navigateToPortfolio}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Forecasting Models
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Utilize advanced forecasting models to predict market trends and make informed decisions, 
                      enabling you to stay ahead in the dynamic world of finance.
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth onClick={navigateToPortfolio}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
