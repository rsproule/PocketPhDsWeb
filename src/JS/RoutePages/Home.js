import '../../CSS/homepage.css';

import Footer from '../Footer.js';

import plogo from '../../Logos/PPHD_clear_back.PNG';
import clockImg from '../../Logos/clock.png';
import freeTrial from '../../Logos/free-trial.jpg';
import empower from '../../Logos/empower.png';
import React, { Component } from 'react';
//bootstrap
import { Col, Jumbotron, Row, Media } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="home">
          <Jumbotron>
            <div className="logo-container">
              <img src={plogo} alt="logo" className="logo" height="150" />
            </div>
            <center>
              <p className="display-4">Unlock your Brain Power</p>
            </center>

            <hr className="my-3" />
            <center>
              <iframe
                width="85%"
                height="600"
                src="https://www.youtube.com/embed/b5hyeHiIcyY"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
              />
            </center>
          </Jumbotron>

          <Jumbotron>
            <Media>
              <img src={empower} className="image" />
              <Media body style={{ padding: 25 + 'px' }}>
                <Media heading>Giving student the power</Media>
                We empower students by connecting them with Brain Coached who
                are PhDs in STEM fields.
              </Media>
            </Media>
          </Jumbotron>

          <Jumbotron>
            <Media>
              <img src={clockImg} className="image" />
              <Media body style={{ padding: 25 + 'px' }}>
                <Media heading>Flexible Availability</Media>
                Forget the hassle of an in-person session! Message your Brain
                Coach at any time.
              </Media>
            </Media>
          </Jumbotron>

          <Jumbotron>
            <Media>
              <img src={freeTrial} className="image" />
              <Media body style={{ padding: 25 + 'px' }}>
                <Media heading>Try it out for free</Media>
                No credit card information required, and the first session in
                salways free!
              </Media>
            </Media>
          </Jumbotron>

          <Jumbotron>
            <p className="display-4">Testimonials</p>
            <hr className="my-3" />
            <div>
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
            </div>
          </Jumbotron>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
