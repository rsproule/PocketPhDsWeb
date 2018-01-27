import facebook from '../../Logos/fb.png';
// import snapchat from '../../Logos/snap.png';
import twitter from '../../Logos/twitter.png';
import youtube from '../../Logos/youtube.png';
import Footer from '../Footer.js';
import React, { Component } from 'react';
import { Button, Card, Col, Jumbotron, Row } from 'reactstrap';

export default class HowItWorks extends Component {
  render() {
    return (
      <div>
        <div style={{ textAlign: 'left', padding: 15 + 'px' }}>
          <Jumbotron>
            <h1 className="display-3">Brain Coaching</h1>
            <p className="lead">
              By creating an account with Pocket PhD's, you gain access to all
              of our brain education material, combined with a Brain Coach
              available by text message to help you work through any problem you
              have in school. Great for individual families and classrooms!
            </p>
            <hr className="my-2" />
            <center>
              <iframe
                title="How it Works"
                className="video"
                src="https://www.youtube.com/embed/b5hyeHiIcyY"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen="true"
              />
            </center>
            <hr className="my-3" />

            <p className="lead">
              If you are a school looking to enhance your classroom with
              neuroscience, <a href="/contact-us">contact us</a> today to
              request a demo.
            </p>
          </Jumbotron>

          <Jumbotron>
            <h1 className="display-3">Tutoring</h1>
            <p className="lead">
              We offer 1-on-1, on-demand, online tutoring for students grade
              6-12 in the follwing subjects:
            </p>
            <hr className="my-2" />

            <Row>
              <Col>
                <div>
                  <b>Math</b>
                  <p>
                    Pre Algebra, Algebra I/II, Geometry, Trigonometry,
                    Pre-Calculus, Calculus
                  </p>
                </div>
              </Col>
              <Col>
                <div>
                  <b>Chemistry</b>
                  <p>
                    Chemistry 5th-12th grade, AP Chemistry, College 100-300
                    Level
                  </p>
                </div>
              </Col>
              <Col>
                <div>
                  <b>Biology</b>
                  <p>
                    Biology 5th-12th Grade up to AP, Anatomy & Physiology,
                    College 100-300 Level
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  <b>Physics</b>
                  <p>5th-12th grade, including AP, College 100-200 level</p>
                </div>
              </Col>
              <Col>
                <div>
                  <b>Standardized Tests</b>
                  <p>ACT & SAT, AP Exams</p>
                </div>
              </Col>
              <Col>
                <div>
                  <b>Writing</b>
                  <p>College Admissions Essays, English Essays</p>
                </div>
              </Col>
            </Row>

            <hr className="my-2" />

            <p className="lead">
              For these services, we offer multiple pricing packages:
            </p>

            <Row>
              <Col>
                <Card>
                  <div style={{ padding: 10 + 'px', textAlign: 'center' }}>
                    <h1 className="display-3">$40</h1>/month
                    <br />
                    <br />
                    <h3>The Socrates</h3>
                    <ol style={{ paddingBottom: 10 + 'px', textAlign: 'left' }}>
                      <li>ACT and SAT Consultation</li>
                      <li>Study Calendar Generation</li>
                      <li>1 Video Session for Strategies</li>
                    </ol>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Button
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfZ1laQiC6RTBSR4hpb8zxvuF8z2PEBwk87SHl5cSmrvTH9rQ/viewform"
                      color="primary"
                    >
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card>
                  <div style={{ padding: 10 + 'px', textAlign: 'center' }}>
                    <h1 className="display-3">$120</h1>/month
                    <br />
                    <br />
                    <h3>The Newton</h3>
                    <ol style={{ paddingBottom: 10 + 'px', textAlign: 'left' }}>
                      <li>4 Video Tutoring Sessions</li>
                      <li>Maximum 1 hour per Session</li>
                      <li>Revisions of Reports + Papers</li>
                    </ol>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Button
                      href="https://docs.google.com/forms/d/e/1FAIpQLSc32evcG8Rq9wEGRYxdmAIdzc62E_4cDrrKP6eBncjibP5jbw/viewform"
                      color="primary"
                    >
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card>
                  <div style={{ padding: 10 + 'px', textAlign: 'center' }}>
                    <h1 className="display-3">$150</h1>/month
                    <br />
                    <br />
                    <h3>The Einstein</h3>
                    <ol style={{ paddingBottom: 10 + 'px', textAlign: 'left' }}>
                      <li>Unlimited Video Tutoring</li>
                      <li>All Subjects besides Test Prep</li>
                      <li>Revisions of Reports + Papers</li>
                    </ol>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Button
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfWGng-dC5EZhNNmfGIYnJQ7n3tKSBRkxtv4eT8MKJjrMzp0g/viewform"
                      color="primary"
                    >
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card>
                  <div style={{ padding: 10 + 'px', textAlign: 'center' }}>
                    <h1 className="display-3">$200</h1>/month
                    <br />
                    <br />
                    <h3>The Hawking</h3>
                    <ol style={{ paddingBottom: 10 + 'px', textAlign: 'left' }}>
                      <li>Unlimited Test Prep Tutoring</li>
                      <li>ACT and SAT Skills Coaching</li>
                      <li>Graded Practice Exams</li>
                    </ol>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Button
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeyGjIuiDD-DrLOSygJgsrwqnuWgsRfkZVr8fvP764Fm1HBKQ/viewform"
                      color="primary"
                    >
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>

            <hr className="my-2" />

            <p className="lead">
              Don't see a package that is right for you?{' '}
              <a href="/contact-us">Contact us</a> and we will figure out a
              solution to satisfy your needs.
            </p>
          </Jumbotron>

          <Jumbotron>
            <h1 className="display-3">Complementary Services</h1>
            <p className="lead">
              Besides our tutoring packages, we offer a variety of content to
              help students succeed
            </p>
            <hr className="my-2" />
            <Row>
              <Col>
                <Card style={{ padding: 15 + 'px' }}>
                  <h3 className="display-4">Test Strategy Tutorials</h3>
                  <p>
                    Visit our YouTube Page to see our test-taking strategies in
                    action to help you ace your next assignment!
                  </p>
                  <center>
                    <a href="https://www.youtube.com/channel/UCxgGE_KNjbll4MngWO-4Sgg/featured">
                      <img src={youtube} alt="youtube" width="45%" />
                    </a>
                  </center>
                </Card>
              </Col>
              <Col>
                <Card style={{ padding: 15 + 'px' }}>
                  <h4 className="display-4">Daily Study Tips</h4>
                  <p>
                    Follow us on social media for daily tips to help improve
                    your study habits in the classroom!
                  </p>
                  <Row>
                    <Col>
                      <center>
                        <a href="https://twitter.com/PocketPhDs">
                          <img src={twitter} alt="twitter" height="100" />
                        </a>
                      </center>
                    </Col>
                    <Col>
                      <center>
                        <a href="https://www.facebook.com/PocketPhDs/">
                          <img src={facebook} alt="facebook" height="100" />
                        </a>
                      </center>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Jumbotron>
        </div>
        <Footer />
      </div>
    );
  }
}
