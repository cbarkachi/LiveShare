import React, { useState, useContext } from "react";
import Heading from "components/UI/Heading/Heading";
import { AgentPictureUploader, FormTitle } from "./AccountSettings.style";
import UploadProfile from "./UploadProfile";
import { firestore } from "base-init";
import { AuthContext } from "context/AuthProvider";
import firebase from "firebase";
import { Alert } from "react-bootstrap";
import { Button } from "components/UI/Button/Button";
import { useHistory } from "react-router-dom";
export default function AgentPictureChangeForm() {
  const [profile, setProfile] = useState();
  const [cover, setCover] = useState();
  const { user } = useContext(AuthContext);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [coverUpdated, setCoverUpdated] = useState(false);
  const history = useHistory();
  function handleSubmit(event) {
    event.preventDefault();
    const storageRef = firebase.storage().ref();
    const userPath = "images/users/" + user.uid + "/";
    if (profile) {
      storageRef
        .child(userPath + "profile")
        .put(profile)
        .then(() => setProfileUpdated(true))
        .catch((error) => console.error("error profile", error));
    }
    if (cover) {
      storageRef
        .child(userPath + "cover")
        .put(cover)
        .then(() => setCoverUpdated(true))
        .catch((error) => console.error("error profile", error));
    }
  }

  return (
    <>
      {profileUpdated ? (
        <Alert variant="success">Successfully updated profile photo!</Alert>
      ) : (
        <></>
      )}
      {coverUpdated ? (
        <Alert variant="success">Successfully updated cover photo!</Alert>
      ) : (
        <></>
      )}
      <AgentPictureUploader>
        <FormTitle>Update Profile Images</FormTitle>
        <Heading content="Profile Picture" as="h4" />
        <UploadProfile setPhoto={setProfile} photo={profile} />
        <br />
        <br />
        <Heading content="Cover Image" as="h4" />
        <UploadProfile setPhoto={setCover} photo={cover} />

        <div className="submit-container">
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </AgentPictureUploader>
    </>
  );
}
