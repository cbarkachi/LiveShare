import React, { useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Divider } from "antd";
import Logo from "components/UI/Logo/Logo";
import { REGISTRATION_PAGE } from "settings/constant";
import Wrapper, {
  Title,
  TitleInfo,
  Text,
  FormWrapper,
  BannerWrapper,
} from "../Auth.style";
// demo image
import signUpImage from "assets/images/login-page-bg.jpg";
import tripFinder from "assets/images/logo-alt.png";
import { Form, Button as BootstrapButton } from "react-bootstrap";
import { AuthContext } from "context/AuthProvider";
import { Button } from "components/UI/Button/Button";
import { useHistory } from "react-router-dom";
import { auth } from "base-init";
import Alert from "react-bootstrap/Alert";
import GoogleButton from "react-google-button";

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState();
  const [submitted, setSubmitted] = useState(false);
  function handleReset(event) {
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        // Email sent.
      })
      .catch(function (error) {
        // An error happened.
        console.error("error occurred");
      });
    setSubmitted(true);
  }
  return submitted ? (
    <Alert variant="success">Password reset link sent to {email}!</Alert>
  ) : (
    <>
      <h3>
        <b>Recover password</b>
      </h3>
      <Form onSubmit={handleReset}>
        <Form.Group>
          <Form.Label className="font-weight-bold">Enter your email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </Form.Group>
        <div className="text-center">
          <Button type="button">Submit</Button>
        </div>
      </Form>
    </>
  );
};

const SignUp = (props) => {
  const email = useRef("");
  const password = useRef("");
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const [forgotPassword, setForgotPassword] = useState(false);

  function handleGoogleAuth(event) {
    event.preventDefault();
    signInWithGoogle();
  }

  function handleEmailAuth(event) {
    event.preventDefault();
    signIn(email.current.value, password.current.value);
  }

  return (
    <Wrapper>
      <FormWrapper>
        <Logo withLink linkTo="/" src={tripFinder} title="LiveShare" />
        <Title>Welcome back</Title>
        <TitleInfo>Sign in to your account</TitleInfo>
        {forgotPassword ? (
          <ForgotPasswordComponent />
        ) : (
          <>
            <Form onSubmit={handleEmailAuth}>
              <Form.Group>
                <Form.Label className="font-weight-bold">Email</Form.Label>
                <Form.Control type="email" ref={email} />
              </Form.Group>
              <Form.Group>
                <Form.Label className="font-weight-bold">Password</Form.Label>
                <Form.Control type="password" ref={password} />
              </Form.Group>
              <div className="text-center mb-4">
                <Button type="submit">Log in</Button>
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  onClick={() => {
                    setForgotPassword(true);
                  }}
                >
                  Forgot your password?
                </Button>
              </div>
            </Form>
            <Divider>Or sign in with</Divider>
            <div className="d-flex justify-content-center">
              <GoogleButton onClick={handleGoogleAuth} label="Google" />
            </div>
            <Text className="mt-3">
              Don't have an account? &nbsp;
              <Link to={REGISTRATION_PAGE}>Register</Link>
            </Text>
          </>
        )}
      </FormWrapper>
      <BannerWrapper>
        <div
          style={{
            backgroundImage: `url(${signUpImage})`,
            backgroundPosition: "center center",
            height: "100vh",
            backgroundSize: "cover",
          }}
        />
      </BannerWrapper>
    </Wrapper>
  );
};

export default SignUp;
