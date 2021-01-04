import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TableDetailsVertical from "./TableDetailsVertical";
import days from "library/constants/days";
import "./RemoveMUIButtonOutline.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TableDetails({
  times,
  tabNames,
  reserve,
  selectedButtons,
  handleChangeButton,
  price
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: "rgb(0, 132, 137)",
            },
          }}
        >
          {[...Array(7)].map((e, i) => {
            return (
              <Tab label={tabNames[i]} {...a11yProps(i)} key={tabNames[i]} />
            );
          })}
        </Tabs>
      </AppBar>
      {days.map((day, i) => {
        return (
          <TabPanel value={value} index={i} key={i} style={{ height: "100%" }}>
            <TableDetailsVertical
              times={times ? times[day] : []}
              reserve={reserve}
              selectedButtons={selectedButtons}
              handleChange={handleChangeButton}
              index={i}
              style={{ height: "20px" }}
              price={price}
            />
          </TabPanel>
        );
      })}
    </div>
  );
}
