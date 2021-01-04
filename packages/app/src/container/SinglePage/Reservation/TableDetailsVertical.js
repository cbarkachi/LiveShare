import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { GiOwl, GiHummingbird } from "react-icons/gi";
import { WiSunset } from "react-icons/wi";
import { IconContext } from "react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faFeather } from "@fortawesome/free-solid-svg-icons";
import { HiSun } from "react-icons/hi";
import { FaRegCalendarTimes } from "react-icons/fa";
import Fab from "@material-ui/core/Fab";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import "./Table.css";
import "./RemoveMUIButtonOutline.css";

function TimeSelection({ time, onClick, backgroundColor, circleSize }) {
  return (
    <Fab
      style={{
        backgroundColor: !backgroundColor
          ? "rgba(0,132,137, 0.9)"
          : backgroundColor,
        color: "white",
        width: circleSize,
        height: circleSize,
        margin: "1rem",
      }}
      color="inherit"
      onClick={onClick}
      aria-label="add"
    >
      <span>{time}</span>
    </Fab>
  );
}

function TimeRow({
  times,
  startIndex,
  reserve,
  handleChange,
  selectedButtons,
  dayIndex,
  price,
}) {
  const curDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  const history = useHistory();
  return (
    <Row>
      {times
        .filter((include) => include)
        .map((_, index) => {
          const timeIndex = startIndex + index;
          const curTime = new Date(
            new Date(curDate.setHours(Math.floor(timeIndex / 2))).setMinutes(
              timeIndex % 2 === 0 ? 0 : 30
            )
          );
          const timeString = curTime.toLocaleTimeString().replace(":00 ", " ");
          return (
            <Col sm="3" key={timeIndex}>
              {reserve ? (
                <Link
                  to={`/book${history.location.pathname.replace(
                    "/listing",
                    ""
                  )}/${dayIndex}/${timeIndex}/${price}`}
                >
                  <TimeSelection time={timeString} circleSize="80px" />
                </Link>
              ) : (
                <TimeSelection
                  time={timeString}
                  onClick={() => handleChange(dayIndex, timeIndex)}
                  selectedButtons
                  backgroundColor={
                    selectedButtons[dayIndex][timeIndex]
                      ? "rgba(0,132,137, 1.00)"
                      : "lightgrey"
                  }
                  circleSize="80px"
                />
              )}
            </Col>
          );
        })}
    </Row>
  );
}

function TabContent({
  times,
  value,
  index,
  startIndex,
  reserve,
  handleChange,
  selectedButtons,
  dayIndex,
  price,
}) {
  return (
    <>
      <TabPanel
        value={value}
        index={index}
        style={{ width: "100%", height: "100%" }}
      >
        <Container className="h-100">
          {times.filter((time) => time).length > 0 ? (
            <TimeRow
              // times={times.length !== 0 && times.slice(0, reserve ? times.length / 2 : times.length)}
              times={times}
              startIndex={startIndex}
              reserve={reserve}
              handleChange={handleChange}
              selectedButtons={selectedButtons}
              dayIndex={dayIndex}
              price={price}
            />
          ) : (
            <div className="text-center h-100 d-flex flex-column justify-content-around align-items-center">
              <Typography variant="h5" color="textSecondary">
                No times available
              </Typography>
              <IconContext.Provider
                value={{ color: "rgba(0, 0, 0, 0.54)", size: "2rem" }}
              >
                <FaRegCalendarTimes />
              </IconContext.Provider>
            </div>
          )}
          {/* <br />
          <br />{" "} */}
          {/* {reserve ? (
            <TimeRow
              times={times.length !== 0 && times.slice(times.length / 2, times.length)}
              startIndex={startIndex + times.length / 2}
              reserve={reserve}
              handleChange={handleChange}
              selectedButtons={selectedButtons}
              dayIndex={dayIndex}
            />
          ) : (
            <></>
          )} */}
        </Container>
      </TabPanel>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            {...other}
          >
            <Box p={3}>{children}</Box>
          </Typography>
        </>
      )}
    </div>
  );
}

function TabHeading({ label, icon, index, onClick }) {
  return (
    <Tab
      label={
        <>
          <span>{label} </span> {icon}
        </>
      }
      onClick={(event) => {
        onClick(index);
      }}
      {...a11yProps(index)}
    />
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "theme.palette.background.paper",
    display: "flex",
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  indicator: {
    backgroundColor: "yellow",
  },
}));

export default function TableDetailsVertical({
  times,
  reserve,
  selectedButtons,
  handleChange,
  index,
  price,
}) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const handleClick = (index) => {
    setTabValue(index);
  };

  return (
    <IconContext.Provider value={{ size: "1.7rem" }}>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          value={tabValue}
          aria-label="Vertical tabs example"
          className={classes.tabs}
          variant="scrollable"
          TabIndicatorProps={{
            style: { background: "rgb(0, 132, 137)" },
          }}
          //   classes={{ tabs: classes.tabs, indicator: classes.indicator }}
        >
          {/*  */}
          {/* 5am to 11:30am */}
          <TabHeading
            label="Morning"
            icon={<GiHummingbird />}
            index={0}
            onClick={handleClick}
          />
          {/* 12pm to 4:30pm */}
          <TabHeading
            label="Afternoon"
            icon={<HiSun />}
            index={1}
            onClick={handleClick}
          />
          {/* 5pm to 11:30pm */}
          <TabHeading
            label="Evening"
            icon={<WiSunset />}
            index={2}
            onClick={handleClick}
          />
          {/* 12am to 5am */}
          <TabHeading
            label="Night"
            icon={<FontAwesomeIcon icon={faMoon} index={3} />}
            index={3}
            onClick={handleClick}
          />
        </Tabs>
        <TabContent
          value={tabValue}
          reserve={reserve}
          index={0}
          times={times.length !== 0 && times.slice(10, 24)}
          startIndex={10}
          selectedButtons={selectedButtons}
          handleChange={handleChange}
          dayIndex={index}
          price={price}
        />
        <TabContent
          value={tabValue}
          reserve={reserve}
          index={1}
          times={times.length !== 0 && times.slice(24, 34)}
          startIndex={24}
          selectedButtons={selectedButtons}
          handleChange={handleChange}
          dayIndex={index}
          price={price}
        />
        <TabContent
          value={tabValue}
          reserve={reserve}
          index={2}
          times={times.length !== 0 && times.slice(34, 48)}
          startIndex={34}
          selectedButtons={selectedButtons}
          handleChange={handleChange}
          dayIndex={index}
          price={price}
        />
        <TabContent
          value={tabValue}
          reserve={reserve}
          index={3}
          times={times.length !== 0 && times.slice(0, 10)}
          startIndex={0}
          selectedButtons={selectedButtons}
          handleChange={handleChange}
          dayIndex={index}
          price={price}
        />
      </div>
    </IconContext.Provider>
  );
}
