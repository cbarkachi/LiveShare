import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { Button } from "components/UI/Button/Button";

const ListingTags = ({ setStep, formData, setFormData }) => {
  const beginnerRef = useRef();
  const intermediateRef = useRef();
  const advancedRef = useRef();
  const freeConsultationRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    const hasBeginner = beginnerRef.current.checked;
    const hasIntermediate = intermediateRef.current.checked;
    const hasAdvanced = advancedRef.current.checked;
    if (!hasBeginner && !hasIntermediate && !hasAdvanced) {
      alert("You must select at least one skill level!");
      return;
    }
    setFormData({
      ...formData,
      beginner: hasBeginner,
      intermediate: hasIntermediate,
      advanced: hasAdvanced,
      freeConsultation: freeConsultationRef.current.checked,
    });
    setStep();
  }
  return (
    <>
      <h2>Additional Info</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Skill Level</Form.Label>
          <Form.Check ref={beginnerRef} type="checkbox" label="Beginner" />
          <Form.Check
            ref={intermediateRef}
            type="checkbox"
            label="Intermediate"
          />
          <Form.Check ref={advancedRef} type="checkbox" label="Advanced" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Free 20-minute consultation?</Form.Label>
          <Form.Check
            ref={freeConsultationRef}
            type="checkbox"
            label="I understand that I will not be paid for an initial 20-minute session with clients who sign up through my lesson page."
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default ListingTags;
