import '../../CSS/homepage.css';

import clockImg from '../../Logos/clock.png';
import empower from '../../Logos/empower.png';
import freeTrial from '../../Logos/free-trial.jpg';
import plogo from '../../Logos/PPHD_clear_back.PNG';
import Footer from '../Footer.js';
import React, { Component } from 'react';
//bootstrap
import {
  Carousel,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  Col,
  Jumbotron,
  Media,
  Button,
  Row
} from 'reactstrap';

/// START
const testemonials = [
  {
    who: 'Amy B., Ladue School District (Missouri)',
    quote:
      "As a parent of a high school sophomore and a school counselor, I highly recommend Pocket PhDs. Their flexibility to help my daughter at virtually any time day or night is unparalleled. Whether working through a complex math problem or studying for a chemistry final, my daughter and I couldn't be more pleased."
  },
  {
    who: 'Melissa M., Undergraduate at the University of Texas',
    quote:
      'Pocket PhDs was so helpful with my chemistry studies. The video chat allowed me to show Wade the questions I was with and he patiently talked me through how to solve them. I would not have passed this course without his help!​'
  },

  {
    who: 'Megan T., Saint Louis, Missouri',
    quote:
      "Tutoring with Alex at Pocket PhD's gave my son the opportunity to ask specific questions in a relaxed environment. Not only did Alex help drastically improve his Algebra grade, but she gave him the confidence to believe that he can be successful at Math."
  }
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }
  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === testemonials.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? testemonials.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }
  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const slides = testemonials.map((test, i) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={i}
        >
          <div style={{ height: 200 + 'px', backgroundColor: 'grey' }} />
          <CarouselCaption captionText={test.quote} captionHeader={test.who} />
        </CarouselItem>
      );
    });

    return (
      <div>
        <div className="home">
          <div className="logo-container">
            <img src={plogo} alt="logo" className="logo" height="80" />

            <h4 className="display-4 title-text">Pocket PhDs</h4>
          </div>

          <hr className="my-3" />

          <center>
            <iframe
              title="Introduction"
              className="video"
              src="https://www.youtube.com/embed/b5hyeHiIcyY"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen="true"
            />
          </center>

          <h4 className="display-4" style={{ fontSize: 22 + 'pt' }}>
            Unlock your Brain Power
          </h4>

          <hr className="my-3" />
          <Row>
            <Col>
              <Jumbotron>
                <div style={{ textAlign: 'center' }}>
                  <img src={empower} alt="empower" className="image" />
                  <Media heading>Personalized Learning</Media>
                  We empower students through engaging neuroscience education
                  content and connecting with a PhD-level expert in STEM fields
                  to build the best study skills for their unique brain.
                </div>
              </Jumbotron>
            </Col>
            <Col>
              <Jumbotron>
                <div style={{ textAlign: 'center' }}>
                  <img src={clockImg} alt="clock" className="image" />
                  <Media heading>Flexible Availability</Media>
                  Forget the hassle of an in-person session! Message your Brain
                  Coach at any time.
                </div>
              </Jumbotron>
            </Col>
            <Col>
              <Jumbotron>
                <div style={{ textAlign: 'center' }}>
                  <img src={freeTrial} alt="trial" className="image" />
                  <Media heading>Try it out for free</Media>
                  No credit card information required, and the first session is
                  always free!
                  <br />
                  <br />
                  <center>
                    <Button
                      href="https://goo.gl/forms/ZR0PhU2d7dRc57Yu2"
                      color="primary"
                    >
                      Click here for a free session
                    </Button>
                  </center>
                </div>
              </Jumbotron>
            </Col>
          </Row>

          <Jumbotron>
            <p className="display-4">Testimonials</p>
            <hr className="my-3" />
            <Carousel
              pause="hover"
              interval="5000"
              activeIndex={this.state.activeIndex}
              next={this.next}
              previous={this.previous}
            >
              <CarouselIndicators
                items={testemonials}
                activeIndex={this.state.activeIndex}
                onClickHandler={this.goToIndex}
              />
              {slides}
              <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={this.previous}
              />
              <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={this.next}
              />
            </Carousel>
            {/* <div>
              <Row>
                <Col>
              <p>
              "As a parent of a high school sophomore and a school
              counselor, I highly recommend Pocket PhDs. Their flexibility
              to help my daughter at virtually any time day or night is
              unparalleled. Whether working through a complex math problem
              or studying for a chemistry final, my daughter and I
              couldn't be more pleased."
              <br />
              <b> - Amy B., Ladue School District (Missouri) </b>
              </p>
                </Col>

                <Col>
              <p>
              "Pocket PhDs was so helpful with my chemistry studies. The
              video chat allowed me to show Wade the questions I was
              struggling with and he patiently talked me through how to
              solve them.
              <br />
              I would not have passed this course without his help!"​
              <br />
              <b>
              {' '}
              - Melissa M., Undergraduate at the University of Texas{' '}
              </b>
              ​
              </p>
                </Col>
              </Row>
              <p>
                "Tutoring with Alex at Pocket PhD's gave my son the opportunity
                to ask specific questions in a relaxed environment. Not only did
                Alex help drastically improve his Algebra grade, but she gave
                him the confidence to believe that he can be successful at
                Math."
                <br />
                <b> - Megan T., Saint Louis, Missouri </b>
              </p>
            </div> */}
          </Jumbotron>

          <Row>
            <Col>
              <center>
                <Button
                  href="https://goo.gl/forms/ZR0PhU2d7dRc57Yu2"
                  color="primary"
                >
                  Click here for a free session
                </Button>
              </center>
            </Col>
            <Col>
              <center>
                <Button href="mailto:wade@pocketphds.com" color="primary">
                  Contact Us Today
                </Button>
              </center>
            </Col>
          </Row>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
