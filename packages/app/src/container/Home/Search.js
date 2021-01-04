import React, { useState } from "react";
import PropTypes from "prop-types";
import Heading from "components/UI/Heading/Heading";
import Text from "components/UI/Text/Text";
import Container from "components/UI/Container/Container";
import GlideCarousel, {
  GlideSlide,
} from "components/UI/GlideCarousel/GlideCarousel";
import BannerWrapper, { SearchWrapper } from "./Search.style";
// slider images
import bannerBg1 from "assets/images/banner/1.jpg";
import bannerBg2 from "assets/images/banner/2.jpg";
import bannerBg3 from "assets/images/banner/3.jpg";
import { Form, Row, Col } from "react-bootstrap";
import { Button } from "components/UI/Button/Button";
import { useHistory } from "react-router-dom";
import goToSearchPage from "library/helpers/search";

const SearchArea = ({ searchTitleStyle, searchDescriptionStyle }) => {
  const [search, setSearch] = useState("");
  //
  const history = useHistory();
  function handleChange(event) {
    setSearch(event.target.value);
  }
  return (
    <BannerWrapper>
      <GlideCarousel
        controls={false}
        options={{ gap: 0, autoplay: 5000, animationDuration: 1000 }}
        bullets={true}
        numberOfBullets={3}
      >
        <>
          <GlideSlide>
            <img src={bannerBg1} alt="Banner 1" />
          </GlideSlide>
          <GlideSlide>
            <img src={bannerBg2} alt="Banner 2" />
          </GlideSlide>
          <GlideSlide>
            <img src={bannerBg3} alt="Banner 3" />
          </GlideSlide>
        </>
      </GlideCarousel>

      <Container>
        <SearchWrapper>
          <Heading
            {...searchTitleStyle}
            content="Find an instructor. Learn a skill. Be your best self."
          />
          <Text
            {...searchDescriptionStyle}
            content="Compare instructors from across the world. Schedule your next lesson at a time that works for you."
          />
          <Form
            className="mt-2"
            onSubmit={(event) => {
              event.preventDefault();
              goToSearchPage(search, history);
            }}
          >
            <Row>
              <Col sm={10} className="px-2">
                <Form.Control
                  type="text"
                  placeholder="Guitar, Programming, Investing..."
                  style={{
                    width: "100%",
                    background: "#eaeaea",
                    border: "0",
                    boxShadow: "none",
                    padding: "0 15px",
                    fontSize: "1.2rem",
                  }}
                  onChange={handleChange}
                  value={search}
                />
              </Col>
              <Col sm={2} className="px-2">
                <Button type="submit">Find instructors</Button>
              </Col>
            </Row>
          </Form>
          {/* <Form>
              <Row>
                <Col sm={6}>
                  
                </Col>
                <Col sm={6}>
                  <Form.Control placeholder="Last name" className="w-100" />
                </Col>
              </Row>
            </Form> */}
        </SearchWrapper>
      </Container>
    </BannerWrapper>
  );
};

SearchArea.propTypes = {
  searchTitleStyle: PropTypes.object,
  searchDescriptionStyle: PropTypes.object,
};

SearchArea.defaultProps = {
  searchTitleStyle: {
    color: "#2C2C2C",
    fontSize: ["20px", "24px", "28px"],
    lineHeight: ["28px", "30px", "30px"],
    mb: "9px",
  },
  searchDescriptionStyle: {
    color: "#2C2C2C",
    fontSize: "15px",
    lineHeight: "24px",
    mb: "30px",
  },
};

export default SearchArea;
