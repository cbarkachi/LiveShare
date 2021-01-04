import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthProvider";
import { Button } from "components/UI/Button/Button";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import firebase from "firebase";
import Transactions from "./Transactions";
import { LinearProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
const baseUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:5001/liveshare-291722/us-central1/app"
    : "https://us-central1-liveshare-291722.cloudfunctions.net/app";
export default function Payment() {
  const { user } = useContext(AuthContext);
  const [loadingButton, setLoadingButton] = useState(false);
  const [verifiedStripe, setVerifiedStripe] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [idToken, setIdToken] = useState(null);
  const [loadingPayments, setLoadingPayments] = useState(true);
  useEffect(() => {
    (async () => {
      console.log(user, user.uid);
      const querySnapshot = await firebase
        .firestore()
        .collection("transactions")
        .where("userId", "==", user.uid)
        .orderBy("date", "desc")
        .get();
      console.log(
        querySnapshot.docs,
        querySnapshot.docs.map((doc) => doc.data())
      );
      setTransactions(querySnapshot.docs.map((doc) => doc.data()));
      setLoadingPayments(false);
      const idToken = await firebase.auth().currentUser.getIdToken(true);
      const statusStripeAccount = await axios.post(
        baseUrl + "/onboard-user/valid-user",
        { idToken }
      );
      setIdToken(idToken);
      setVerifiedStripe(statusStripeAccount.data.status);
    })();
  }, []);
  async function handleStripe() {
    setLoadingButton(true);
    const fetchUrl = baseUrl + "/onboard-user";
    try {
      const onboardUser = await axios.post(fetchUrl, { idToken });
      const stripeUrl = onboardUser.data.url;
      window.location = stripeUrl;
    } catch (err) {}
  }
  console.log(transactions);
  return (
    <>
      {verifiedStripe === null ? null : !verifiedStripe ? (
        <Button onClick={handleStripe}>
          {loadingButton ? (
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span>Loading</span>
            </>
          ) : (
            <span>Connect to Stripe</span>
          )}
        </Button>
      ) : (
        <div className="d-flex justify-content-around">
          <Button
            onClick={() => window.open("https://dashboard.stripe.com/login")}
          >
            Visit your Stripe Dashboard
          </Button>
          <Button onClick={handleStripe}>
            Edit your Stripe Account Information
          </Button>
        </div>
      )}
      <br />
      <br />
      <Typography variant="h4">Recent Transactions</Typography>
      {loadingPayments ? (
        <LinearProgress />
      ) : transactions.length > 0 ? (
        <Transactions transactions={transactions} />
      ) : (
        <Typography variant="h6">You have no recent orders</Typography>
      )}
    </>
  );
}
