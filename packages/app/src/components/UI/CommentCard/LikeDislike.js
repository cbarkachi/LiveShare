import React, { useState, Fragment } from "react";
import { Tooltip } from "antd";
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
} from "@ant-design/icons";
import { firestore } from "base-init";
import firebase from "firebase";

export default function LikeDislike({ reviewRef }) {
  return reviewRef ? <ChildLikeDislike reviewRef={reviewRef} /> : <></>;
}

const ChildLikeDislike = ({ reviewRef }) => {
  const [state, setState] = useState({
    likes: reviewRef ? reviewRef.data().numUpvotes : 0,
    dislikes: reviewRef ? reviewRef.data().numDownvotes : 0,
    action: localStorage.getItem("reviewAction-" + reviewRef.id),
  });
  const handleLike = () => {
    if (state.action === "liked") {
      return;
    }
    let newLiked = state.likes + 1,
      newDisliked = state.dislikes;
    reviewRef.ref.update({
      numUpvotes: firebase.firestore.FieldValue.increment(1),
    });
    if (state.action === "disliked") {
      reviewRef.ref.update({
        numDownvotes: firebase.firestore.FieldValue.increment(-1),
      });
      newDisliked--;
    }
    setState({
      ...state,
      likes: newLiked,
      dislikes: newDisliked,
      action: "liked",
    });
    localStorage.setItem("reviewAction-" + reviewRef.id, "liked");
  };

  const handleDisLike = () => {
    if (state.action === "disliked") {
      return;
    }
    let newLiked = state.likes,
      newDisliked = state.dislikes + 1;
    reviewRef.ref.update({
      numDownvotes: firebase.firestore.FieldValue.increment(1),
    });
    if (state.action === "liked") {
      reviewRef.ref.update({
        numUpvotes: firebase.firestore.FieldValue.increment(-1),
      });
      newLiked--;
    }
    setState({
      ...state,
      likes: newLiked,
      dislikes: newDisliked,
      action: "disliked",
    });
    localStorage.setItem("reviewAction-" + reviewRef.id, "disliked");
  };

  return (
    <Fragment>
      <span className="comment-helpful">
        <Tooltip title="Like">
          {state.action === "liked" ? (
            <LikeFilled onClick={handleLike} />
          ) : (
            <LikeOutlined onClick={handleLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: "auto" }}>{state.likes}</span>
      </span>
      <span className="comment-report">
        <Tooltip title="Dislike">
          {state.action === "disliked" ? (
            <DislikeFilled onClick={handleDisLike} />
          ) : (
            <DislikeOutlined onClick={handleDisLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: "auto" }}>{state.dislikes}</span>
      </span>
    </Fragment>
  );
};
