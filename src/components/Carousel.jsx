import React, { useState, useEffect } from "react";
import BaseCardCarousel from "./builders/BaseCardCarousel";
import { Container, Row, Spinner, Col } from "reactstrap";
import axios from "axios";

const Carousel = () => {
  const [carouselDatas, setCarouselDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCarousel();
  }, []);
  const getCarousel = async () => {
    try {
      const res = await axios.get(
        "https://btz-js-202003-p3-lookup-back.jsrover.wilders.dev/carousels/"
      );
      setCarouselDatas(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  return (
    <Container>
      <Row className="d-flex justify-content-center">
        <h1>Carousel</h1>
      </Row>
      <Row>
        {carouselDatas.map((it) => (
          <Col md="4" sm="6" xs="12" className="pb-4">
            <BaseCardCarousel
              key={it.uuid}
              uuid={it.uuid}
              titre={it.title}
              link={it.link}
              picture={it.picture}
              descriptif={it.description}
              getCarousel={getCarousel}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Carousel;
