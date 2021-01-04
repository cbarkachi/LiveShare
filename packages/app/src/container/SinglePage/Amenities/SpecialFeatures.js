import React from "react";
import PropTypes from "prop-types";
import Heading from "components/UI/Heading/Heading";
import TextLink from "components/UI/TextLink/TextLink";
import { FaFreeCodeCamp, FaWpbeginner } from "react-icons/fa";
import { GiLevelTwoAdvanced } from "react-icons/gi";
import { MdBrightnessMedium, MdAttachMoney } from "react-icons/md";
import IconCard from "components/IconCard/IconCard";
import SpecialFeaturesWrapper, {
  SpecialFeaturesArea,
} from "./SpecialFeatures.style";
import { TextButton } from "../SinglePageView.style";
import { Element } from "react-scroll";

const SpecialFeatures = ({ titleStyle, linkStyle, listingData }) => {
  const features = [
    {
      value: listingData.beginner,
      title: "Beginner-friendly",
      icon: <FaWpbeginner />,
    },
    {
      value: listingData.intermediate,
      title: "Works with intermediate-level students",
      icon: <MdBrightnessMedium />,
    },
    {
      value: listingData.advanced,
      title: "Works with advanced-level students",
      icon: <GiLevelTwoAdvanced />,
    },
    {
      value: listingData.freeConsultation,
      title: "Free 20-minute consultation",
      icon: <FaFreeCodeCamp />,
    },
    {
      value: listingData.price < 3000,
      title: "Affordable",
      icon: <MdAttachMoney />,
    },
  ];

  return (
    <Element name="specialFeatures" className="SpecialFeatures">
      <SpecialFeaturesWrapper>
        <Heading as="h2" content="Special Features" {...titleStyle} />
        <SpecialFeaturesArea>
          {features
            .filter((feature) => feature.value)
            .map((feature, i) => {
              return (
                <IconCard
                  icon={feature.icon}
                  title={<b>{feature.title}</b>}
                  className="mr-5 mb-5"
                />
              );
            })}
        </SpecialFeaturesArea>
      </SpecialFeaturesWrapper>
    </Element>
  );
};

SpecialFeatures.propTypes = {
  titleStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

SpecialFeatures.defaultProps = {
  titleStyle: {
    color: "#2C2C2C",
    fontSize: ["17px", "20px", "25px"],
    lineHeight: ["1.15", "1.2", "1.36"],
    mb: ["14px", "20px", "30px"],
  },
  linkStyle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#008489",
  },
};

export default SpecialFeatures;
