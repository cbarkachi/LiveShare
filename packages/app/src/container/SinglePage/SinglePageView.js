import React, { Fragment, useState, useEffect, useContext } from "react";
import { useLocation } from "library/hooks/useLocation";
import Sticky from "react-stickynode";
import { Row, Col, Modal, Button } from "antd";
import Container from "components/UI/Container/Container";
import Loader from "components/Loader/Loader";
import useWindowSize from "library/hooks/useWindowSize";
import Description from "./Description/Description";
import SpecialFeatures from "./Amenities/SpecialFeatures";
import Review from "./Review/Review";
import Reservation from "./Reservation/Reservation";
import BottomReservation from "./Reservation/BottomReservation";
import TopBar from "./TopBar/TopBar";
import SinglePageWrapper, { PostImage } from "./SinglePageView.style";
import PostImageGallery from "./ImageGallery/ImageGallery";
import useDataApi from "library/hooks/useDataApi";
import isEmpty from "lodash/isEmpty";
import firebase from "firebase";
import formatPrice from "library/helpers/formatPrice";
import { AuthContext } from "context/AuthProvider";
import { firestore } from "base-init";
import ReservationModal from "./Reservation/ReservationModal";
import getParentDoc from "library/helpers/getParentDoc";
import getUrlComponents from "library/helpers/getUrlComponents";
import { useHistory } from "react-router-dom";
import anonymousProPic from "assets/images/anonymous-profile.png";
import getImageFromUser from "library/helpers/getImageFromUser";
import days from "library/constants/days";
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

function getDateString(d) {
  const fullDate = monthNames[d.getMonth()] + " " + d.getDate();
  return fullDate;
}

function getDateStrings() {
  const dates = ["Today", "Tomorrow"];
  for (let i = 2; i < 7; i++) {
    const date = new Date(new Date().setDate(new Date().getDate() + i));
    const a = getDateString(date);
    dates.push(a);
  }
  return dates;
}

const SinglePage = ({ match }) => {
  const { href } = useLocation();
  const [isModalShowing, setIsModalShowing] = useState(false);
  const { width } = useWindowSize();
  const [listingData, setListingData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [modifiedReviews, setModifiedReviews] = useState([]);
  const [reviewRefs, setReviewRefs] = useState([]);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [times, setTimes] = useState({});
  const [instructorInfo, setInstructorInfo] = useState(null);
  const [_, userId, listingId] = getUrlComponents(useHistory());
  const [instructorImg, setInstructorImg] = useState(null);
  const [reviewsStats, setReviewsStats] = useState({});
  const listingRef = firestore
    .collection("users")
    .doc(userId)
    .collection("listings")
    .doc(listingId);
  function grabImage(mainPath, index) {
    return firebase
      .storage()
      .ref(mainPath + index)
      .getDownloadURL();
  }
  useEffect(() => {
    listingRef.get().then((docSnapshot) => {
      setListingData(docSnapshot.data());
    });
    listingRef.collection("reviews").onSnapshot((reviewsSnapshot) => {
      const collectedReviews = [];
      const collectedRefs = [];
      reviewsSnapshot.forEach((reviewRef) => {
        if (reviewRef.id !== "stats") {
          collectedReviews.push(reviewRef.data());
          collectedRefs.push(reviewRef);
        }
      });
      setReviews(collectedReviews);
      setModifiedReviews(collectedReviews);
      setReviewRefs(collectedRefs);
    });
    const mainPath = `images/listings/${listingId}/`;
    const imagePromises = [
      grabImage(mainPath, 0),
      grabImage(mainPath, 1),
      grabImage(mainPath, 2),
    ];
    Promise.all(
      imagePromises.map((p) =>
        p.catch((error) => console.error("image error: ", error))
      )
    ).then((values) => {
      setImages(values.filter((image) => image));
    });
    firestore
      .collection("users")
      .doc(userId)
      .collection("availability")
      .doc("availability")
      .get()
      .then((userSnapshot) => {
        const timesFromSunday = userSnapshot.data().times;
        const offset = new Date().getDay();
        const newTimesMap = {};
        for (let i = 0; i < 7; i++) {
          newTimesMap[days[(i - offset + 7) % 7]] = timesFromSunday[days[i]];
        }
        setTimes(newTimesMap);
      });
    firestore
      .collection("users")
      .doc(userId)
      .get()
      .then((userSnapshot) => {
        setInstructorInfo(userSnapshot.data());
      });
    (async () => {
      setInstructorImg(await getImageFromUser(userId, true));
    })();
    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("listings")
      .doc(listingId)
      .collection("reviews")
      .doc("stats")
      .get()
      .then((reviewStatsDoc) => {
        setReviewsStats(reviewStatsDoc.data());
      });
  }, []);
  console.log("all", reviews, reviewsStats);
  if (!listingData) return <Loader />;
  return (
    <SinglePageWrapper>
      <PostImage backgroundImage={images[0]}>
        <Button
          type="primary"
          onClick={() => setIsModalShowing(true)}
          className="image_gallery_button"
        >
          View Photos
        </Button>
        <Modal
          visible={isModalShowing}
          onCancel={() => setIsModalShowing(false)}
          footer={null}
          width="100%"
          maskStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
          wrapClassName="image_gallery_modal"
          closable={false}
        >
          <Fragment>
            <PostImageGallery images={images} />
            <Button
              onClick={() => setIsModalShowing(false)}
              className="image_gallery_close"
            >
              <svg width="16.004" height="16" viewBox="0 0 16.004 16">
                <path
                  id="_ionicons_svg_ios-close_2_"
                  d="M170.4,168.55l5.716-5.716a1.339,1.339,0,1,0-1.894-1.894l-5.716,5.716-5.716-5.716a1.339,1.339,0,1,0-1.894,1.894l5.716,5.716-5.716,5.716a1.339,1.339,0,0,0,1.894,1.894l5.716-5.716,5.716,5.716a1.339,1.339,0,0,0,1.894-1.894Z"
                  transform="translate(-160.5 -160.55)"
                  fill="#909090"
                />
              </svg>
            </Button>
          </Fragment>
        </Modal>
      </PostImage>

      <ReservationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        times={times}
        tabNames={getDateStrings()}
        price={listingData.price}
      />
      {/* <TopBar title={null} shareURL={href} author={null} media={images} /> */}

      <Container>
        <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
          <Col xl={16}>
            <Description
              content={listingData?.description}
              title={listingData?.title}
              location={"poop location"}
            />
            <SpecialFeatures listingData={listingData} />
          </Col>
          <Col xl={8}>
            {width > 1200 ? (
              <Sticky
                innerZ={999}
                activeClass="isSticky"
                top={202}
                bottomBoundary="#reviewSection"
              >
                <Reservation
                  price={
                    listingData?.price
                      ? formatPrice(listingData.price, false, false, true)
                      : null
                  }
                  email={instructorInfo?.email}
                  name={
                    instructorInfo
                      ? instructorInfo.firstName + " " + instructorInfo.lastName
                      : " "
                  }
                  setModalVisible={setModalVisible}
                  modalVisible={modalVisible}
                  instructorImg={instructorImg}
                  instructorId={userId}
                />
              </Sticky>
            ) : (
              <BottomReservation
                title={listingData?.title}
                price={
                  listingData?.price
                    ? formatPrice(listingData.price, false, false, true)
                    : ""
                }
                rating={
                  reviewsStats
                    ? reviewsStats.ratings_total / reviewsStats.ratings_count
                    : 0
                }
                ratingCount={
                  reviewsStats?.ratings_count ? reviewsStats?.ratings_count : 0
                }
                setModalVisible={setModalVisible}
              />
            )}
          </Col>
        </Row>
        <Row gutter={30}>
          <Col xl={16}>
            <Review
              reviews={modifiedReviews}
              allReviews={reviews}
              setModifiedReviews={setModifiedReviews}
              reviewRefs={reviewRefs}
              ratingCount={reviewsStats?.ratings_count}
              rating={
                reviewsStats
                  ? reviewsStats.ratings_total / reviewsStats.ratings_count
                  : 0
              }
              listingRef={listingRef}
            />
          </Col>
          <Col xl={8} />
        </Row>
      </Container>
    </SinglePageWrapper>
  );
};

export default SinglePage;
