import React, { useState, useContext } from "react";
import { Progress } from "antd";
import { useHistory } from "react-router-dom";
import BasicInformation from "./BasicInformation";
import ListingPhotos from "./ListingPhotos";
import ListingDetails from "./ListingDetails";
import ListingTags from "./ListingTags";
import Stepper from "./AddListing.style";
import firebase from "firebase";
import { firestore } from "base-init";
import { AGENT_PROFILE_PAGE } from "settings/constant";
import { AuthContext } from "context/AuthProvider";

const AddListing = () => {
  let stepComponent;
  const [formData, setFormData] = useState({
    ratings_count: 0,
    ratings_total: 0,
  });
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(1);

  const history = useHistory();
  const { user } = useContext(AuthContext);

  async function finalSet() {
    const doc = await firestore
      .collection("users")
      .doc(user.uid)
      .collection("listings")
      .add(formData);
    const storageRef = firebase.storage().ref();
    const imageUploads = [];
    for (let i = 0; i < images.length; i++) {
      const imageRef = storageRef.child("images/listings/" + doc.id + "/" + i);
      imageUploads.push(imageRef.put(images[i]));
    }
    Promise.all(imageUploads).then(() => {});
    firestore
      .collection("users")
      .doc(user.uid)
      .collection("listings")
      .doc(doc.id)
      .update({ id: doc.id });

    history.push(`${AGENT_PROFILE_PAGE}/${user.uid}`);
  }
  function incrementStep() {
    return setStep(step + 1);
  }
  switch (step) {
    case 1:
      stepComponent = (
        <BasicInformation
          setStep={incrementStep}
          formData={formData}
          setFormData={setFormData}
        />
      );
      break;

    case 2:
      stepComponent = (
        <ListingPhotos setStep={incrementStep} setImages={setImages} />
      );
      break;

    case 3:
      stepComponent = (
        <ListingDetails
          setStep={incrementStep}
          formData={formData}
          setFormData={setFormData}
        />
      );
      break;

    case 4:
      stepComponent = (
        <ListingTags
          setStep={incrementStep}
          formData={formData}
          setFormData={setFormData}
        />
      );
      break;

    default:
      finalSet();
  }

  return (
    <div className="m-5">
      <Stepper>
        <Progress
          className="stepper-progress"
          percent={step * 25}
          showInfo={false}
        />
        {stepComponent}
      </Stepper>
    </div>
  );
};

export default AddListing;
