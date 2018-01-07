import '../../CSS/homepage.css';

import Footer from '../Footer.js';

import plogo from '../../Logos/PocketPhDsLogo.JPG';
import React, { Component } from 'react';
//bootstrap
import { Col, Jumbotron, Row } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="home">
          <div className="logo-container">
            <img src={plogo} alt="logo" className="logo" height="150" />
          </div>
          <Jumbotron>
            <p className="display-4">Unlock your Brain Power</p>
            <hr className="my-3" />
            <div className="info-paragraph">
              <p>
                We empower students by connecting them with experts in math,
                science, and engineering. All of our tutors have or are pursuing
                a doctoral degree in these fields.
              </p>

              <p>
                Forget the hassle of setting up an in-person tutoring session!
                Message your tutor any time for help to start an online session.
                ​
              </p>

              <p>
                No Credit Card Information needed, and the first session is
                always free
              </p>
            </div>
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
