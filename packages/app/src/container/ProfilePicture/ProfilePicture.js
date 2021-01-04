import React, { useState, useEffect } from "react";
import { ProfileImage } from "container/Agent/AccountDetails/AgentDetails.style";
import Image from "components/UI/Image/Image";
import { ProfilePicLoader } from "components/UI/ContentLoader/ContentLoader";
import getImageFromUser from "library/helpers/getImageFromUser";

export default function ProfilePicture({ user }) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    async function getProfile() {
      setProfile(await getImageFromUser(user.uid, true));
    }
    getProfile();
  });
  return (
    <ProfileImage>
      {profile ? (
        <Image src={profile} alt="Profile Pic" />
      ) : (
        <ProfilePicLoader />
      )}
    </ProfileImage>
  );
}
