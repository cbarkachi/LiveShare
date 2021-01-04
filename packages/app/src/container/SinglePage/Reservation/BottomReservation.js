import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Rating from "components/UI/Rating/Rating";
import { Button, Modal } from "antd";
import StickyBooking from "components/StickyBooking/StickyBooking";
import LogoImage from "assets/images/logo-alt.png";
import Reservation from "./Reservation";

const BottomReservation = ({
  title,
  price,
  rating,
  ratingCount,
  email,
  setModalVisible,
}) => {
  return (
    <>
      <StickyBooking
        logo={LogoImage}
        title={title}
        price={price}
        rating={
          <Rating rating={rating} ratingCount={ratingCount} type="bulk" />
        }
        action={
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            Book
          </Button>
        }
      />
    </>
  );
};

export default BottomReservation;
