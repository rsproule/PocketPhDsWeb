import Footer from '../Footer.js';
import React, { Component } from 'react';
import { Col, Jumbotron, Row } from 'reactstrap';

export default class FAQ extends Component {
  render() {
    return (
      <div>
        <div style={{ padding: 15 + 'px', textAlign: 'left' }}>
          <Jumbotron>
            <center>
              <p className="display-4">Frequently Asked Questions</p>
            </center>
            <hr className="my-3" />
            <b>What is a Brain Coach?</b>
            <hr className="my-3" />
            Brain coaches are our word for tutors, but they are so much more
            than subject experts! In addition to being a PhD-level educator,
            brain coaches understand the best teaching practices to work with
            students on building effective study habits and skills that relate
            to the best practices and innovative research in neuroscience,
            psychology, and education.
            <br />
            <br />
            <hr className="my-3" />
            <br />
            <br />
            <Row>
              <Col>
                <b>Do you perform background checks on your Brain Coaches?</b>
                <hr className="my-3" />
                YES! All new Pocket PhD's Brain Coaches undergo rigorous
                background checks and interviews before working with any
                student.
              </Col>
              <Col>
                <b>How are Brain Coaches selected for my student?</b>
                <hr className="my-3" />
                We customize every Brain Coach team to make sure we bring
                together the best team for your student. Before a a Brain Coach
                is added to the team, we consult with each individual student
                and family to ensure they are comfortable with our selections.
              </Col>
            </Row>
            <br />
            <br />
            <hr className="my-3" />
            <br />
            <br />
            <Row>
              <Col>
                <b>How do I pay?</b>
                <hr className="my-3" />
                We use Invoice Ninja, a 3rd Party, cloud payment software to
                send you an invoice. In this invoice, you are able to type in
                your credit card information to pay us. We will NEVER ask for
                your personal credit card information!
              </Col>
              <Col>
                <b>Do I have to schedule an appointment?</b>
                <hr className="my-3" />
                No! If you have a question while you are doing your homework
                late at night or on the weekend, your Brain Coaches will be
                available to help you. You also can talk with your Brain Coaches
                if you want to schedule appointments in advance.
              </Col>
            </Row>
            <br />
            <br />
            <hr className="my-3" />
            <br />
            <br />
            <Row>
              <Col>
                <b>Do I have to meet with my Brain Coach?</b>
                <hr className="my-3" />
                No! Pocket PhDs is designed to let you get help with your
                studies without the scheduling and traveling for an appointment.
                You simply request a Brain Coach using your phone, and then chat
                with them via video call, phone call, or instant messaging.
              </Col>
              <Col>
                <b>Can we do in-person coaching sessions?</b>
                <hr className="my-3" />
                We will perform one-on-one coaching on an individual case basis,
                and is limited to the St. Louis area. Please give us a call if
                this is something you are interested in pursuing.
              </Col>
            </Row>
            <br />
            <br />
            <hr className="my-3" />
            <br />
            <br />
            <Row>
              <Col>
                <b>Who are the Brain Coaches?</b>
                <hr className="my-3" />
                All Brain Coaches at Pocket PhDs are PhD candidates or have been
                granted a PhD. Our Brain Coaches are passionate about learning
                and educating others, as seen by their commitment to pursue
                doctoral degrees in math, science, and engineering.
              </Col>
              <Col>
                <b>Why are PhDs the best Brain Coaches?</b>
                <hr className="my-3" />
                As a PhD, you are trained to think through difficult problems
                and use all of your resources to find a solution. PhDs are also
                trained in the best education practices to pursue careers as
                professors at academic universities, and are required to work as
                teaching...
              </Col>
            </Row>
            <hr className="my-3" />
          </Jumbotron>
        </div>
        <Footer />
      </div>
    );
  }
}
