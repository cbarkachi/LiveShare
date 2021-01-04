import React, { useContext, useState } from "react";
import { auth } from "base-init";
import { AuthContext } from "context/AuthProvider";
import { Alert } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import forgotPasswordImg from "assets/images/forgot_password.png";
import styles from "./styles.css";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

function ImgMediaCard({ handleReset }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="forgot-password"
          height="140"
          image={forgotPasswordImg}
          title="forgot-password"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Use the button below to receive a reset password link at the email
            address associated with your account
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button onClick={handleReset}>Reset password</Button>
      </CardActions>
    </Card>
  );
}

export default function ChangePassWord() {
  const [sent, setSent] = useState(false);
  const { user } = useContext(AuthContext);

  function handleReset() {
    auth
      .sendPasswordResetEmail(user.email)
      .then(function () {
        // Email sent.
      })
      .catch(function (error) {
        // An error happened.
        console.error("error occurred");
      });
    setSent(true);
  }

  return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
      {sent ? (
        <Alert variant="success">
          Password reset link sent to {user.email}!
        </Alert>
      ) : (
        <></>
      )}
      <ImgMediaCard handleReset={handleReset} />
    </div>
  );
}
