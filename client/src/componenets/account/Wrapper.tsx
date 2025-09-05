import * as React from "react";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Account from "./Account";
import UserPassword from "./UserPassword";
import FriendList from "./FriendList";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Wrapper = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#F7F7F7",
          my: { sm: "0rem", xs: "1rem" },
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            width: { xs: "95%", sm: "80%", md: "30%" },
            height: "716px",
            overflowY: "auto",
          }}
        >
          <AppBar position="static" sx={{ backgroundColor: "#EA7070" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="User Account" {...a11yProps(0)} />
              <Tab label="Change Password" {...a11yProps(1)} />
              <Tab label="Frends List" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Account />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <UserPassword />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <FriendList />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default Wrapper;
