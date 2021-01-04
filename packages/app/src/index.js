import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "themes/default.theme";
import GlobalStyles from "assets/style/Global.style";
import UserContext from "context/AuthProvider";
import Routes from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "fontsource-roboto";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { algoliasearch } from "algoliasearch";
import { InstantSearch } from "react-instantsearch-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { testSecretKey } from "config/stripe";

const stripePromise = loadStripe(testSecretKey);

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <BrowserRouter>
      <UserContext>
        <Elements stripe={stripePromise}>
          <InstantSearch searchClient={algoliasearch} indexName="listings">
            <Routes />
          </InstantSearch>
        </Elements>
      </UserContext>
    </BrowserRouter>
  </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
