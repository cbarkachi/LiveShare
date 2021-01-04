import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "context/AuthProvider";
import { firestore } from "base-init";
import zoomImg from "assets/images/zoom_intro.png";
import Typography from "@material-ui/core/Typography";

const redirectURL = "https://liveshare-291722.web.app/account-settings/zoom";
const clientID = "8SODcTO_T9U2RnP4KjMhQ";
export default function IntegrateZoom(props) {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  let code = history.location.search
    ? history.location.search.split("=")[1]
    : null;
  const [zoomRefresh, setZoomRefresh] = useState(null);
  const [authenticationStatus, setAuthenticationStatus] = useState(false);
  useEffect(() => {
    if (code) {
      axios
        .get(
          `https://us-central1-liveshare-291722.cloudfunctions.net/app/zoom?userId=${user.uid}&code=${code}`
        )
        .then(() => {
          setAuthenticationStatus(true);
        })
        .catch((err) => {
          setAuthenticationStatus(false);
        });
    }
    firestore
      .collection("users")
      .doc(user.uid)
      .collection("private")
      .doc("private")
      .get()
      .then((docSnap) => {
        setZoomRefresh(docSnap.data().zoomRefreshToken);
      })
      .catch((err) => {});
  }, []);
  if (zoomRefresh === null) {
    return null;
  }
  let displayComponent;
  if (zoomRefresh) {
    displayComponent = (
      <div>
        <Typography variant="h4" className="text-center">
          You've already linked your Zoom account!
        </Typography>
        <img src={zoomImg} alt="zoom-connected" />
      </div>
    );
  } else if (code) {
    displayComponent = (
      <h3>
        {authenticationStatus
          ? "You've successfully linked your Zoom account!"
          : "There was an error validating your account"}
      </h3>
    );
  } else {
    displayComponent = (
      <a
        href={`https://zoom.us/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://marketplacecontent.zoom.us/zoom_marketplace/img/add_to_zoom.png"
          height="32"
          alt="Add to ZOOM"
        />
      </a>
    );
  }
  return displayComponent;
}
