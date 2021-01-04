import React, { useState } from "react";
import { Progress } from "antd";
import Stepper from "./BookListing.style";
import Pay from "./Pay";

const BookListing = () => {
  let stepComponent;
  // alert("hello");
  const [step, setStep] = useState(1);

  function incrementStep() {
    alert("yer");
    return setStep(step + 1);
  }
  switch (step) {
    case 1:
      stepComponent = <Pay setStep={incrementStep} />;
      break;
    case 2:
      stepComponent = <h2>Success!</h2>;
      break;

    default:
  }

  return (
    <>
      <Stepper>
        <Progress
          className="stepper-progress"
          percent={step * 50}
          showInfo={false}
        />
        {stepComponent}
      </Stepper>
    </>
  );
};

export default BookListing;
