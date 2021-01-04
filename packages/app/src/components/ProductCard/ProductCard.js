import React, { useState, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import TextLink from "components/UI/TextLink/TextLink";
import Rating from "components/UI/Rating/Rating";
import Favourite from "components/UI/Favorite/Favorite";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import GridCard from "../GridCard/GridCard";
import formatPrice from "library/helpers/formatPrice";
import { SINGLE_POST_PAGE } from "settings/constant";
import getImageFromUser from "library/helpers/getImageFromUser";
import anonymousProfile from "assets/images/anonymous-profile.png";
import ProfilePicture from "container/ProfilePicture/ProfilePicture";
import { ProfilePicLoader } from "components/UI/ContentLoader/ContentLoader";
import { ProfileImage } from "container/Agent/AccountDetails/AgentDetails.style";
const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 1,
    paritialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

const PostGrid = ({ listing, curFavorites, setCurFavorites }) => {
  const { skill, instructor, listingId, instructorId } = listing;
  const url = `${SINGLE_POST_PAGE}/${instructorId}/${listingId}`;
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    async function getPicture() {
      let curPhoto;
      curPhoto = await getImageFromUser(instructorId, true);
      setPhoto(curPhoto);
    }
    getPicture();
  }, []);
  return (
    <GridCard
      isCarousel={true}
      favorite={
        <Favourite
          id={listingId}
          curFavorites={curFavorites}
          setCurFavorites={setCurFavorites}
        />
      }
      location={`${instructor.firstName} ${instructor.lastName}`}
      title={<TextLink link={{ pathname: url }} content={skill.title} />}
      price={`${formatPrice(skill.price, true)}`}
      rating={
        <Rating
          rating={skill.ratings_total / skill.ratings_count}
          ratingCount={skill.ratings_count}
          type="bulk"
        />
      }
      viewDetailsBtn={
        <TextLink
          link={{ pathname: url }}
          icon={<FiExternalLink />}
          content="View Details"
        />
      }
    >
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        renderDotsOutside={false}
        responsive={responsive}
        showDots={true}
        sliderClass=""
        slidesToSlide={1}
      >
        {photo ? (
          <img
            src={photo}
            alt={"Instructor's profile"}
            key={listingId}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "relative",
              right: "15px",
            }}
          />
        ) : (
          <ProfilePicLoader />
        )}
      </Carousel>
    </GridCard>
  );
};

export default PostGrid;
