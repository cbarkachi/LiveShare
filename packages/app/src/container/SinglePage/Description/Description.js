import React from "react";
import PropTypes from "prop-types";
import { Element } from "react-scroll";
import Rating from "components/UI/Rating/Rating";
import Heading from "components/UI/Heading/Heading";
import Text from "components/UI/Text/Text";
import DescriptionWrapper from "./Description.style";
import { RatingMeta } from "../SinglePageView.style";

const Description = ({
  title,
  location,
  content,
  rating,
  ratingCount,
  titleStyle,
  locationMetaStyle,
  contentStyle,
  dontShowReview,
}) => {
  return (
    <Element name="overview" className="overview">
      <DescriptionWrapper>
        <Text content={location.formattedAddress} {...locationMetaStyle} />
        <Heading as="h2" content={title} {...titleStyle} className="mb-5" />
        <Heading
          as="h4"
          content={"My experience"}
          {...titleStyle}
          className="mb-3"
        />
        {/* {!dontShowReview ? (
          <RatingMeta>
            <Rating rating={rating} ratingCount={ratingCount} type="bulk" />
          </RatingMeta>
        ) : (
          <></>
        )} */}
        <Text content={content} {...contentStyle} />
      </DescriptionWrapper>
    </Element>
  );
};

export default Description;
