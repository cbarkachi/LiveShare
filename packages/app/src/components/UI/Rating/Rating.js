import React from "react";
import PropTypes from "prop-types";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

const Rating = (props) => {
  const { rating, ratingCount, type, ratingFieldName } = props;
  let i, floorValue;
  let ratingView = [];
  floorValue = Math.floor(rating);
  for (i = 0; i < 5; i++) {
    if (i < floorValue) {
      ratingView.push(<IoIosStar key={i} />);
    } else {
      ratingView.push(<IoIosStarOutline key={i} />);
    }
  }

  const showRatingCount = `(` + ratingCount + `)`;

  return (
    <>
      {type && type === "bulk" ? (
        <>
          <span>{ratingView}</span>
          <strong>{`${showRatingCount}`}</strong>
        </>
      ) : (
        <>
          {ratingFieldName ? <span>{ratingFieldName}</span> : <></>}
          {ratingView}
        </>
      )}
    </>
  );
};

Rating.propTypes = {
  type: PropTypes.string.isRequired,
  ratingCount: PropTypes.number,
  rating: PropTypes.number,
  ratingFieldName: PropTypes.string,
};

export default Rating;
