import React, { Fragment, useState, useEffect, useContext } from "react";
import { FormTitle } from "./AccountSettings.style";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { AuthContext } from "context/AuthProvider";
import { firestore } from "base-init";
import { Button } from "components/UI/Button/Button";

const LANGUAGES = [
  "",
  "Arabic",
  "English",
  "French",
  "Hindi",
  "Mandarin",
  "Portuguese",
  "Russian",
  "Spanish",
];
export default () => {
  const [formData, setFormData] = useState({});
  const { user } = useContext(AuthContext);
  const [updatedProfile, setUpdatedProfile] = useState(false);
  const [email, setEmail] = useState();
  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .get()
      .then((docSnapshot) => {
        const {
          firstName,
          lastName,
          phoneNumber,
          location,
          language,
          description,
        } = docSnapshot.data();
        setFormData({
          firstName,
          lastName,
          phoneNumber,
          location,
          language,
          description,
        });
        setEmail(user.email);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    firestore
      .collection("users")
      .doc(user.uid)
      .update({ ...formData });
    if (email !== user.email) {
      user.updateEmail(email);
    }
    setUpdatedProfile(true);
  }

  function updateFormComponent(field) {
    return (event) => {
      setFormData({ ...formData, [field]: event.target.value });
    };
  }
  return (
    <Fragment>
      {updatedProfile ? (
        <Alert variant="success">Successfully updated profile!</Alert>
      ) : (
        <></>
      )}
      <FormTitle>Basic Information</FormTitle>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Label>
              <b>First name</b>
            </Form.Label>
            <Form.Control
              type="text"
              onChange={updateFormComponent("firstName")}
              value={formData.firstName || ""}
            />
          </Col>
          <Col>
            <Form.Label>
              <b>Last name</b>
            </Form.Label>
            <Form.Control
              type="text"
              onChange={updateFormComponent("lastName")}
              value={formData.lastName || ""}
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col>
            <Form.Label>
              <b>Email address</b>
            </Form.Label>
            <Form.Control
              type="text"
              value={email || ""}
              onChange={(event) => setEmail(event.target.value)}
              disabled
            />
          </Col>
          <Col>
            <Form.Label>
              <b>Phone number</b>
            </Form.Label>
            <Form.Control
              type="text"
              onChange={updateFormComponent("phoneNumber")}
              value={formData.phoneNumber || ""}
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col>
            <Form.Label>
              <b>Where you're from</b>
            </Form.Label>
            <Form.Control
              type="text"
              onChange={updateFormComponent("location")}
              value={formData.location || ""}
            />
          </Col>
          <Col>
            <Form.Label>
              <b>Preferred language</b>
            </Form.Label>
            <Form.Control
              as="select"
              onChange={updateFormComponent("language")}
              value={formData.language || ""}
            >
              {LANGUAGES.map((language) => (
                <option value={language} key={language}>
                  {language}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col>
            <Form.Label>
              <b>Describe yourself</b>
            </Form.Label>
            <Form.Control
              type="text"
              onChange={updateFormComponent("description")}
              value={formData.description || ""}
              as="textarea"
              rows="3"
            />
          </Col>
        </Row>
        <Row>
          <Col className="text-right">
            <Button type="submit" className="mt-5">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};
