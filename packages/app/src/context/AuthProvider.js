import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth, firestore } from "base-init";
import { AGENT_PROFILE_PAGE, HOME_PAGE, LOGIN_PAGE } from "settings/constant";
import getMapFromTimesArray from "library/helpers/getMapFromTimesArray";
import getUrlComponents from "library/helpers/getUrlComponents";
import firebase from "firebase/app";
import "firebase/auth";

export const AuthContext = React.createContext();

const AuthProvider = (props) => {
  let history = useHistory();
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);
  const [googleProvider, setGoogleProvider] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    });
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope(
      "https://www.googleapis.com/auth/contacts.readonly"
    );
    setGoogleProvider(googleProvider);
    auth.useDeviceLanguage();
    return unsubscribe;
  }, []);

  async function addUserToStore(user, fields) {
    const userDoc = firestore.collection("users").doc(user.uid);
    await userDoc.set(fields);
    await userDoc
      .collection("availability")
      .doc("availability")
      .set({
        times: getMapFromTimesArray(Array(7).fill(Array(48).fill(false))),
      });
    setUser(user);
    setLoggedIn(true);
  }
  const signIn = (email, password) => {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      alert("You've entered an invalid email address");
      return;
    }
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        history.push(`${AGENT_PROFILE_PAGE}/${user.user.uid}`);
      })
      .catch(function (error) {
        alert("Incorrect email or password");
        history.push(LOGIN_PAGE);
      });
  };

  function signInWithGoogle() {
    auth
      .signInWithPopup(googleProvider)
      .then(async function (result) {
        const oAuthToken = result.credential.accessToken;
        const user = result.user;
        const [firstName, lastName] = user.displayName;
        const userDocRef = firestore.collection("users").doc(user.uid);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          if (!userDoc.data().oAuthToken) {
            alert("That email is already associated with a LiveShare account");
            return;
          }
        } else {
          await addUserToStore(user, { firstName, lastName, oAuthToken });
        }
        history.push(`${AGENT_PROFILE_PAGE}/${user.uid}`);
      })
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        console.error(
          `Failed google sign in with error code ${errorCode} and message ${errorMessage} for user ${email} (credential ${credential})`
        );
      });
  }

  const signUp = (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      alert("Passwords must match");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      alert("You've entered an invalid email address");
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (cred) => {
        await addUserToStore(cred.user, { firstName: "", email });
        history.push(`${AGENT_PROFILE_PAGE}/${cred.user.uid}`);
      })
      .catch((error) => {
        console.error(error);
        alert("Unknown error");
      })
      .catch(function (error) {
        console.error(error);
        alert("That user id already exists");
      });
  };

  const logOut = () => {
    auth.signOut();
    history.go(0);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        logOut,
        signIn,
        signInWithGoogle,
        signUp,
        user,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
