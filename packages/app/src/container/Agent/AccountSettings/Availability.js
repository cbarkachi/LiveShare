import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "context/AuthProvider";
import TableDetails from "container/SinglePage/Reservation/TableDetails";
import days from "library/constants/days";
import { Alert } from "react-bootstrap";
import { Button } from "components/UI/Button/Button";
import { firestore } from "base-init";
import getMapFromTimesArray from "library/helpers/getMapFromTimesArray";

export default function Availability() {
  const { user } = useContext(AuthContext);
  const [updated, setUpdated] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState(null);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .collection("availability")
      .doc("availability")
      .get()
      .then((docSnap) => {
        const times = docSnap.data().times;
        const buttons = [];
        for (let i = 0; i < 7; i++) {
          buttons.push(times[days[i]]);
        }
        setSelectedButtons(buttons);
      });
  }, []);

  function handleChange(changeDayIndex, changeTimeIndex) {
    setSelectedButtons(
      selectedButtons.map((dayTimes, dayIndex) =>
        dayIndex !== changeDayIndex
          ? dayTimes
          : dayTimes.map((isOn, timeIndex) =>
              timeIndex !== changeTimeIndex ? isOn : !isOn
            )
      )
    );
  }
  function handleUpdateAvailability() {
    const mapTimes = {};
    for (let i = 0; i < days.length; i++) {
      mapTimes[days[i]] = selectedButtons[i];
    }
    firestore
      .collection("users")
      .doc(user.uid)
      .collection("availability")
      .doc("availability")
      .set({ times: mapTimes });
    setUpdated(true);
  }
  const times = getMapFromTimesArray(Array(7).fill(Array(48).fill(true)));
  return (
    <>
      {updated ? (
        <Alert variant="success">Successfully updated availability!</Alert>
      ) : (
        <></>
      )}
      <></>
      {selectedButtons ? (
        <TableDetails
          handleChangeButton={handleChange}
          selectedButtons={selectedButtons}
          tabNames={days}
          times={times}
          reserve={false}
        />
      ) : (
        <></>
      )}
      <br />
      <br />
      <br />
      <br />
      <Button onClick={handleUpdateAvailability} className="mt-5 d-block">
        Update availability
      </Button>
    </>
  );
}
