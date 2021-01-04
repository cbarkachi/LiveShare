import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AgentItem from "./AgentItem";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function CenteredGrid({ listings, userId }) {
  const classes = useStyles();
  console.log("first", listings);
  console.log("WHAT TEH FUCK");
  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          {listings.map((listing) => {
            console.log("HEYYY");
            return (
              <Grid item xs={3}>
                <AgentItem listing={listing} userId={userId} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
}
