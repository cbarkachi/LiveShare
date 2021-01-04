import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "components/UI/Button/Button";
import { firestore } from "base-init";
import firebase from "firebase";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const Rater = ({ rating, setRating }) => {
  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          key={rating}
        />
      </Box>
    </div>
  );
};

const ReviewForm = ({ listingRef, handleModalClose }) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const headingNameRef = useRef();
  const descriptionRef = useRef();
  const [rating, setRating] = useState();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!rating) {
      alert("You must fill out all required fields!");
      return;
    }
    listingRef
      .collection("reviews")
      .add({
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        heading: headingNameRef.current.value,
        description: descriptionRef.current.value,
        profilePicture:
          "https://cdn4.iconfinder.com/data/icons/linecon/512/photo-512.png",
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        numUpvotes: 0,
        numDownvotes: 0,
        rating: rating,
      })
      .catch((error) => {
        alert(error);
        return;
      });
    listingRef
      .collection("reviews")
      .doc("stats")
      .set(
        {
          ratings_count: firebase.firestore.FieldValue.increment(1),
          ratings_total: firebase.firestore.FieldValue.increment(rating),
        },
        { merge: true }
      );
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    headingNameRef.current.value = "";
    descriptionRef.current.value = "";
    setRating(null);
    handleModalClose();
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" ref={firstNameRef} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" ref={lastNameRef} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" ref={headingNameRef} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Review</Form.Label>
        <Form.Control type="text" as="textarea" ref={descriptionRef} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Leave a rating</Form.Label>
        <Rater setRating={setRating} rating={rating} />
      </Form.Group>
      <Button type="submit" style={{ backgroundColor: "#008489" }}>
        Submit
      </Button>
    </Form>
  );
};

export default ReviewForm;
