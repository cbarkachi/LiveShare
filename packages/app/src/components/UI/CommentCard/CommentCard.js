import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import moment from "moment";
import LikeDislike from "./LikeDislike";
import Rating from "../Rating/Rating";

export default class App extends React.Component {
  render() {
    const { singleReview, reviewRef } = this.props;
    const reviewAuthorFirstName = singleReview ? singleReview.firstName : "";
    const reviewAuthorLastName = singleReview ? singleReview.lastName : "";
    const authorName = reviewAuthorFirstName + " " + reviewAuthorLastName;
    const content = singleReview ? singleReview.description : "";
    const reviewTitle = singleReview ? singleReview.heading : "";
    const commentDate = singleReview
      ? singleReview.timestamp.seconds * 1000
      : "";
    const postTime = new Date(commentDate).getTime();
    const authorAvatar = singleReview ? singleReview.profilePicture : "";
    const numUpvotes = 100000;
    const numDownvotes = singleReview ? singleReview.numDownvotes : "";
    const rating = singleReview ? singleReview.rating : 0;
    console.log("sr", singleReview)
    return (
      <div className="comment-area">
        <div className="comment-wrapper">
          <div className="comment-header">
            <div className="avatar-area">
              <div className="author-avatar">
                <img src={authorAvatar} alt="Profile" />
              </div>
              <div className="author-info">
                <h3 className="author-name">{authorName}</h3>
                <div className="comment-date">
                  <Popover
                    placement="bottom"
                    content={moment(commentDate).format(
                      "dddd, MMMM Do YYYY, h:mm:ss a"
                    )}
                  >
                    <span>Posted {moment(postTime).fromNow()}</span>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="rating-area">
              <LikeDislike reviewRef={reviewRef} />
            </div>
          </div>
          <div className="comment-body">
            <h4>{reviewTitle}</h4>
            <p>{content}</p>
          </div>
          <div className="comment-rating">
            <div className="rating-widget">
              <Rating rating={rating} ratingFieldName="" type="individual" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
