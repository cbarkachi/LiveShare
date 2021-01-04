import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import formatPrice from "library/helpers/formatPrice";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Transactions({ transactions }) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Lesson Duration</TableCell>
            <TableCell align="right">Lesson Name</TableCell>
            <TableCell align="right">Lesson Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => (
            <TableRow key={row.date}>
              <TableCell component="th" scope="row">
                {row.date.toDate().toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {formatPrice(row.amount, true, true, true)}
              </TableCell>
              <TableCell align="right">{row.duration}</TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
