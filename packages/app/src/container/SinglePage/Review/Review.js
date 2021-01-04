import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { IoIosStar, IoIosStarOutline, IoIosArrowDown } from "react-icons/io";
import { Row, Col, Button, Input, Checkbox, Divider, Modal } from "antd";
import CommentCard from "components/UI/CommentCard/CommentCard";
import Heading from "components/UI/Heading/Heading";
import Text from "components/UI/Text/Text";
import ReviewForm from "./ReviewForm";
import ReviewWrapper, {
  HeaderSection,
  RatingStatus,
  FilterElement,
  RatingSearch,
  RatingWrapper,
  TextButton,
  ModalTitle,
} from "./Review.style";
import { Element } from "react-scroll";
import { maxHeight } from "styled-system";

const Search = Input.Search;
const CommentBox = (props) => {
  const { reviews, reviewRefs } = props;
  return reviews && reviews.length !== 0
    ? reviews.map((singleReview, i) => {
        return (
          <Fragment key={i}>
            <Divider />
            <CommentCard
              singleReview={singleReview}
              reviewRef={reviewRefs ? reviewRefs[i] : null}
            />
          </Fragment>
        );
      })
    : "No Reviews Found";
};

const Review = (props) => {
  const {
    ratingCount,
    reviews,
    statusHeadingStyle,
    reviewRefs,
    rating,
    listingRef,
    setModifiedReviews,
    allReviews,
  } = props;

  const [state, setState] = useState({
    review: false,
    language: false,
  });
  const handleModalOpen = (key) => {
    setState({ ...state, [key]: true });
  };
  const handleModalClose = (key) => {
    setState({ ...state, [key]: false });
  };
  const onChange = (e) => {};

  return (
    <Element name="reviews" className="reviews">
      <ReviewWrapper>
        <HeaderSection>
          <RatingStatus>
            <Heading
              content={`${reviews.length} Review${
                reviews.length === 1 ? "" : "s"
              }`}
              {...statusHeadingStyle}
            />
            {[...Array(rating ? Math.ceil(rating) : 0)].map((e, i) => (
              <IoIosStar key={i} />
            ))}
          </RatingStatus>
          <RatingSearch>
            <Search
              placeholder="Search reviews"
              onSearch={(value) =>
                setModifiedReviews(
                  allReviews.filter((review) => {
                    const combined =
                      review.description +
                      review.heading +
                      review.firstName +
                      review.lastName;
                    return combined.toLowerCase().includes(value.toLowerCase());
                  })
                )
              }
            />
            <Button type="primary" onClick={() => handleModalOpen("review")}>
              Write a review
            </Button>
            <Modal
              visible={state.review}
              onCancel={() => handleModalClose("review")}
              footer={null}
              width="100%"
              maskStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              wrapClassName="review_modal"
            >
              <ModalTitle>Write your review here</ModalTitle>
              <ReviewForm
                listingRef={listingRef}
                handleModalClose={() => {
                  handleModalClose("review");
                }}
              />
            </Modal>
          </RatingSearch>
        </HeaderSection>
        <CommentBox reviews={reviews} reviewRefs={reviewRefs} />
      </ReviewWrapper>
    </Element>
  );
};

Review.propTypes = {
  statusHeadingStyle: PropTypes.object,
  filterHeadingStyle: PropTypes.object,
  ratingLabelStyle: PropTypes.object,
  ratingCountStyle: PropTypes.object,
};

Review.defaultProps = {
  statusHeadingStyle: {
    color: "#2C2C2C",
    fontSize: ["17px", "20px", "25px"],
    mr: "10px",
  },
  filterHeadingStyle: {
    color: "#2C2C2C",
    fontSize: "15px",
    fontWeight: "700",
    lineHeight: "1.2",
    mb: "0.5em",
  },
  ratingLabelStyle: {
    fontSize: "13px",
    fontWeight: "400",
    color: "#2c2c2c",
    flex: "1",
  },
  ratingCountStyle: {
    fontSize: "13px",
    fontWeight: "400",
    color: "#2c2c2c",
    ml: "8px",
  },
};

export default Review;
