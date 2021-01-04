import React, { useRef, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { Divider } from "antd";
import Logo from "components/UI/Logo/Logo";
import { LOGIN_PAGE, HOME_PAGE } from "settings/constant";
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
// import { useHistory } from "react-router-dom";
import { AuthContext } from "context/AuthProvider";
import { Button } from "components/UI/Button/Button";

const SignUp = () => {
  const { signUp, loggedIn } = useContext(AuthContext);
  const email = useRef("");
  const password = useRef("");
  const confirmPassword = useRef("");
  if (loggedIn) {
    return <Redirect to={{ pathname: HOME_PAGE }} />;
  }

  function handleGoogleAuth(event) {
    event.preventDefault();
    return;
  }

  function handleEmailAuth(event) {
    event.preventDefault();
    signUp(
      email.current.value,
      password.current.value,
      confirmPassword.current.value
    );
  }

  return (
    <Wrapper>
      <FormWrapper>
        <Logo withLink linkTo="/" src={tripFinder} title="LiveShare" />
        <Title>Welcome to LiveShare</Title>
        <TitleInfo>Register for your account</TitleInfo>
        <Form onSubmit={handleEmailAuth}>
          <Form.Group>
            <Form.Label className="font-weight-bold">Email</Form.Label>
            <Form.Control type="email" ref={email} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="font-weight-bold">Password</Form.Label>
            <Form.Control type="password" ref={password} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="font-weight-bold">
              Confirm Password
            </Form.Label>
            <Form.Control type="password" ref={confirmPassword} />
          </Form.Group>
          <div className="text-center">
            <Button type="submit">Sign up</Button>
          </div>
        </Form>
        <Divider>Or register with</Divider>
        <div className="d-flex justify-content-center">
          <BootstrapButton
            className="google-btn btn-danger"
            style={{ width: "50%", marginBottom: 16 }}
            size="large"
            onClick={handleGoogleAuth}
          >
            Google
          </BootstrapButton>
        </div>
        <Text className="mt-3">
          Already have an account? &nbsp;
          <Link to={LOGIN_PAGE}>Login</Link>
        </Text>
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
