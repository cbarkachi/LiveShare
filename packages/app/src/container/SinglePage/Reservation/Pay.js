import React, { useEffect, useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import days from "library/constants/days";
import axios from "axios";
import CardSection from "./CardSection";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "components/UI/Button/Button";
import { Spinner, Form } from "react-bootstrap";
import { auth } from "base-init";
import { AuthContext } from "context/AuthProvider";
import Typography from "@material-ui/core/Typography";
// import "./Pay.css";
import formatPrice from "library/helpers/formatPrice";

export default function Pay({ setStep }) {
  const history = useHistory();
  const [
    userId,
    listingId,
    dayIndex,
    timeIndex,
    price,
  ] = history.location.pathname.split("/").slice(2, 7);
  const day = days[dayIndex];
  const [stripeSecret, setStripeSecret] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    if (!stripe || !elements || !stripeSecret) {
      return;
    }
    const result = await stripe.confirmCardPayment(stripeSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: firstNameRef.current.value + " " + lastNameRef.current.value,
          email: emailRef.current.value,
          phone: phoneRef.current.value,
        },
      },
    });

    if (result.error) {
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setStep();
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const fetchUrl =
          window.location.hostname === "localhost"
            ? "http://localhost:5001/liveshare-291722/us-central1/app/create-payment-intent"
            : "https://us-central1-liveshare-291722.cloudfunctions.net/app/create-payment-intent";
        const userId = history.location.pathname.split("/")[2];
        const response = await axios.post(fetchUrl, {
          userId,
          listingId,
          day,
          timeIndex,
        });
        setStripeSecret(response.data.clientSecret);
      } catch (err) {}
    })();
  }, []);

  return (
    <>
      <Typography variant="h4" className="mb-4">
        Order Total: {formatPrice(price, true, true)}
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" ref={firstNameRef} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" ref={lastNameRef} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" ref={emailRef} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" ref={phoneRef} required />
        </Form.Group>
        <CardSection />
        <div className="text-right">
          <Button type="submit" $disabled={!stripeSecret}>
            {processing ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span>Loading</span>{" "}
              </>
            ) : (
              <span>Confirm order</span>
            )}
          </Button>
        </div>
      </Form>
    </>
  );
}
