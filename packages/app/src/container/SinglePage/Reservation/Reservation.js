import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Card from "components/UI/Card/Card";
import Heading from "components/UI/Heading/Heading";
import Text from "components/UI/Text/Text";
import TextLink from "components/UI/TextLink/TextLink";
import formatPrice from "library/helpers/formatPrice";
import { Button } from "components/UI/Button/Button";
import { ProfilePicLoader } from "components/UI/ContentLoader/ContentLoader";
import { ProfileImage } from "container/Agent/AccountDetails/AgentDetails.style";
import Image from "components/UI/Image/Image";
import LinkStyle from "./LinkStyle.css";
import { NavLink } from "react-router-dom";

const CardHeader = ({
  priceStyle,
  pricePeriodStyle,
  linkStyle,
  price,
  email,
}) => {
  if (price) {
  }
  return (
    <Fragment>
      <Heading
        content={
          <Fragment>
            {price ? `$${price}` : ""}{" "}
            <Text as="span" content="/ lesson" {...pricePeriodStyle} />
          </Fragment>
        }
        {...priceStyle}
      />
      <a href={`mailto:${email}`} style={{ color: "#008489" }}>
        Contact instructor
      </a>
    </Fragment>
  );
};

export default function Reservation({
  price,
  email,
  setModalVisible,
  instructorImg,
  name,
  instructorId,
}) {
  return (
    <Card
      className="reservation_sidebar"
      header={<CardHeader price={price} email={email} />}
      content={
        <>
          <div className="d-flex align-items-center flex-column">
            <h5 className="mb-3">
              <b>
                <NavLink
                  to={`/profile/${instructorId}`}
                  className="instructor-name"
                >
                  {name}
                </NavLink>
              </b>
            </h5>
            <ProfileImage>
              {instructorImg ? (
                <Image src={instructorImg} alt="Profile Pic" />
              ) : (
                <ProfilePicLoader />
              )}
            </ProfileImage>
            <br />
            <Button onClick={() => setModalVisible(true)}>Book now</Button>
          </div>
        </>
      }
      footer={
        <div>
          Have any questions the instructor can't answer?{" "}
          <a href="mailto:cbarkachi@gmail.com" style={{ color: "#008489" }}>
            Contact us
          </a>
        </div>
      }
    />
  );
}

CardHeader.propTypes = {
  priceStyle: PropTypes.object,
  pricePeriodStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

CardHeader.defaultProps = {
  priceStyle: {
    color: "#2C2C2C",
    fontSize: "25px",
    fontWeight: "700",
  },
  pricePeriodStyle: {
    fontSize: "15px",
    fontWeight: "400",
  },
  linkStyle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#008489",
  },
};
