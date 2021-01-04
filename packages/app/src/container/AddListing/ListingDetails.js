import React from "react";
import LessonDetails from "./FreeTimes";

const ListingDetails = ({ setStep, formData, setFormData }) => {
  return (
    <>
      <h2>Lesson Details</h2>
      <LessonDetails
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />
    </>
  );
};

export default ListingDetails;
