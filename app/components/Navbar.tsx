"use client";
import Link from "next/link";
import { AppBar, Toolbar, Button, Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";

const CustomButton = styled(Button)({
  fontFamily: "'Poppins', sans-serif", // Custom font
  fontSize: "1.5rem", // Larger font size
  fontWeight: 600, // Bold font
  textTransform: "uppercase", // Uppercase for modern look
  letterSpacing: "1px", // Slight letter spacing
  color: "#fff", // White text color
  margin: "0 15px", // Spacing between buttons
  "&:hover": {
    backgroundColor: "#2C3E50", // Slightly darker on hover
    transform: "scale(1.05)", // Subtle scale effect
    textShadow: "0px 0px 5px rgb(229, 236, 226)", // Glowing effect on hover
    transition: "all 0.3s ease", // Smooth transition
  },
});

const Logo = styled("img")({
  height: "50px", // Adjust the height for the logo
  width: "auto", // Keep the aspect ratio
  marginRight: "20px", // Space between logo and the navigation buttons
  "@media (max-width: 768px)": {
    height: "40px", // Smaller logo size for mobile
  },
});

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg,rgb(176, 199, 207),rgb(62, 177, 212))", // Gradient from purple to pink
     
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Link href="/" passHref>
            <IconButton>
              <Logo src="https://cdn.pixabay.com/photo/2016/11/07/13/04/yoga-1805784_1280.png" alt="Logo" />
            </IconButton>
          </Link>
          <Link href="/" passHref>
            <CustomButton>
              Home
            </CustomButton>
          </Link>
          <Link href="/portfolio" passHref>
            <CustomButton>
              Portfolio Optimizer
            </CustomButton>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
