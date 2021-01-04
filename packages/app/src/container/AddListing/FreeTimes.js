import React, { useRef } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Button } from "components/UI/Button/Button";

export default function LessonDetails({ formData, setFormData, setStep }) {
  const durationRef = useRef();
  const priceRef = useRef();
  function handleSubmit(event) {
    event.preventDefault();
    setFormData({
      ...formData,
      duration: +durationRef.current.value,
      price: +priceRef.current.value * 100,
    });
    setStep();
  }

  return (
    <>
      <Form className="w-100" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Lesson duration (min.)</Form.Label>
          <Form.Control type="number" ref={durationRef} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price per lesson</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control ref={priceRef} type="number" required />
          </InputGroup>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}
