import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

export default function ChooseTime({ setSelectedTime, times }) {
  const [timeRows, setTimeRows] = useState([]);

  useEffect(() => {
    const today = new Date();
    const dayIndex = today.getDay() - 1;
    //   assuming we start grabbing from tomorrow onward
    const sundayIndex = 7 - dayIndex - 1;
    const rows = [];
    for (let i = 0; i < 48; i++) {
      const time = new Date(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ).setHours(Math.floor(i / 2))
      ).setMinutes(i % 2 === 0 ? 0 : 30);
      const timeString = new Date(time)
        .toLocaleTimeString()
        .replace(":00 ", " ");
      const availables = [];
      for (let j = sundayIndex; j < 7; j++) {
        availables.push(times[j][i]);
      }
      for (let j = 0; j < sundayIndex; j++) {
        availables.push(times[j][i]);
      }
      rows.push({ timeString, availables });
    }
    setTimeRows(rows);
  }, []);
  return (
    <Table striped bordered hover style={{ padding: "10%" }}>
      <thead>
        <tr>
          <th style={{ padding: "0 3rem" }}></th>
          <th>Sunday</th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
        </tr>
      </thead>
      <tbody>
        {timeRows.map(({ timeString, availables }, i) => {
          return (
            <tr key={i}>
              <td>{timeString}</td>
              {availables.map((available, j) => (
                <td key={j}>{available ? "Yes" : "No"}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
