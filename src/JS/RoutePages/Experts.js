import React, { Component } from 'react';
import {
  Col,
  Jumbotron,
  Row,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import Footer from '../Footer.js';

import wade from '../../Logos/wade.png';
import alex from '../../Logos/alex.png';
import nathan from '../../Logos/experts/nathan.jpg';
import ben from '../../Logos/experts/Ben.jpg';
import allison from '../../Logos/experts/alison.png';
import kethleen from '../../Logos/experts/kathleen.jpg';
import mariah from '../../Logos/experts/Mariah.jpg';
import sabin from '../../Logos/experts/Sabin.jpg';
import anna from '../../Logos/experts/anna.jpg';
import alex2 from '../../Logos/experts/Alex-cammock.jpg';
import tab from '../../Logos/experts/Tab.jpg';
import krissy from '../../Logos/experts/krissy.png';
import renee from '../../Logos/experts/Renee.jpg';
import keith from '../../Logos/experts/keith.jpg';
import wade1 from '../../Logos/experts/wade.png';
import marg from '../../Logos/experts/marg.jpg';
import alex1 from '../../Logos/experts/alex1.jpg';
const experts = [
  {
    src: { nathan },
    altText: 'Nathan Kopp',
    name: 'Nathan Kopp',
    quote:
      'I am a fan of playing volleyball and binge watching my favorite shows: Will & Grace, Roseanne, and The Big Bang Theory.',
    about:
      'B.S. Biology, Truman State University. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Writing.'
  },

  {
    src: { ben },
    altText: 'Ben Seitzman',
    name: 'Ben Seitzman',
    quote:
      'I enjoy baseball, softball, and ultimate frisbee. reading, binge-watching Netflix/HBO, and all things sci-fi/fantasy.',
    about:
      'B.S. Mathematics, B.S. Neuroscience, Indiana University. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Chemistry, Physics '
  },
  {
    src: { allison },
    altText: 'Allison Soung',
    name: 'Allison Soung',
    quote:
      "I like baking, eating what I've baked, and then running and/or swimming so I can repeat without too much guilt",
    about:
      'B.S. Cell Biology, University of California-Berkeley. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Test Prep'
  },
  {
    src: { kethleen },
    altText: 'Kathleen Schoch',
    name: 'Kathleen Schoch',
    quote:
      'I enjoy rock climbing, biking, and half marathons (of both the running and Netflix type). My favorite color is purple and I dislike mashed potatoes.',
    about:
      'B.S. Molecular and Cell Biology, Bradley University. Ph.D Physiology, University of Kentucky. Subject Expertise: Biology, Writing'
  },
  {
    src: { mariah },
    altText: 'Mariah Lawler',
    name: 'Mariah Lawler',
    quote:
      "I'm always planning my next trip and getting lost in a good book. I love to craft and sing. I also enjoy all things basic: brunch on Sundays and lattes on lattes.",
    about:
      'B.S. Biochemistry, Iowa State University. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Biology, Chemistry, Writing, Test Prep'
  },

  {
    src: { anna },
    altText: 'Anna Boudoures',
    name: 'Anna Boudoures',
    quote:
      'I love science of all types, cooking and baking, being outside as much as possible, and visiting the art museum!',
    about:
      'B.S. Biology, Minor in Chemistry, Denison University. Ph.D, Molecular Cell Biology, Washington University. Subject Expertise: Biology, Chemistry, Writing, Test Prep'
  },
  {
    src: { sabin },
    altText: 'Sabin Nettles',
    name: 'Sabin Nettles',
    quote: 'I enjoy playing and watching soccer, and playing the violin.',
    about:
      'B.S. Psychology with a Minor in History, Boston College. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Chemistry, Writing'
  },
  {
    src: { alex2 },
    altText: 'Alex Cammack',
    name: 'Alex Cammack',
    quote:
      'In my spare time, you can find me playing jazz or tossing a frisbee. More importantly, I have an adorable dog named Lulu who enjoys belly rubs.',
    about:
      'B.S. Cell and Molecular Biology, Tulane University. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Biology, Test Prep'
  },
  {
    src: { tab },
    altText: 'Tabbetha Bohac',
    name: 'Tabbetha Bohac',
    quote:
      "I enjoy Mountain Dew, pizza, Nike and sports.  I hate spiders and I've been told I brighten a room, but I think that's just my clothes",
    about:
      'B.S. Biological Chemistry, University of Chicago. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Chemistry'
  },
  {
    src: { renee },
    altText: 'Renee Sears',
    name: 'Renee Sears',
    quote: 'I enjoy biking, crafts, hiking, genetics, and reading.',
    about:
      'B.S. Biological Sciences, Cornell University. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Chemistry, Test Prep'
  },
  {
    src: { krissy },
    altText: 'Krissy Sakers',
    name: 'Krissy Sakers',
    quote:
      'I enjoy traveling, training and spending time with my dog, and playing intramural sports.',
    about:
      'B.S. Biological Sciences, Rutgers University. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Writing '
  },
  {
    src: { keith },
    altText: 'Keith Johnson',
    name: 'Keith Johnson',
    quote:
      'I enjoy rock climbing and playing with computers. My favorite color is mauve and I dislike sour cream.',
    about:
      'B.S. Neuroscience, University of Oklahoma. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Chemistry, Physics'
  },
  {
    src: { wade1 },
    altText: 'Wade Self',
    name: 'Wade Self',
    quote:
      "When I'm not playing softball, I am honing my skills as a barbecue connoisseur.",
    about:
      'B.S. Biomedical Engineering, Case Western Reserve. Ph.D Candidate, Washington University in St. Louis .Subject Expertise: Math, Chemistry, Physics, Test Prep'
  },
  {
    src: { marg },
    altText: 'Margaret Hayne ',
    name: 'Margaret Hayne ',
    quote: 'I enjoy birdwatching and being outside.',
    about:
      'B.S. Biology, University of Wisconsin-Madison. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Chemistry, Test Prep'
  },
  {
    src: { alex1 },
    altText: 'Alex Russo',
    name: 'Alex Russo',
    quote:
      'I love playing and listening to music, and hiding indoors in the air conditioning when STL has 100 degree summer days.',
    about:
      'B.S. Biology, Spanish, Georgetown University. Ph.D Candidate, Washington University in St. Louis. Subject Expertise: Math, Biology, Chemistry, Test Prep'
  }
];

export default class Experts extends Component {
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
      this.state.activeIndex === experts.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? experts.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }
  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }
  render() {
    const slides = experts.map((expert, i) => {
      var imgSrc = Object.values(expert.src)[0];
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={i}
        >
          <div
            style={{
              width: 100 + '%',
              backgroundColor: 'grey',
              textAlign: 'center'
            }}
          >
            <img
              src={imgSrc}
              alt={expert.altText}
              height="400"
              object-fit="scale-down"
            />
          </div>
          <CarouselCaption captionHeader={expert.name} />
        </CarouselItem>
      );
    });

    return (
      <div>
        <div style={{ padding: 15 + 'px' }}>
          <Jumbotron>
            <h2 className="display-4">Meet the Pocket PhDs Team</h2>

            <hr className="my-3" />

            <Row>
              <Col>
                <div
                  style={{
                    padding: 10 + 'px',
                    textAlign: 'left',
                    textIndent: 25 + 'px'
                  }}
                >
                  <p>
                    We founded Pocket PhDs with one mission: to connect students
                    with the brightest minds we know to maximize their
                    educational experience.
                  </p>
                  <p>
                    With years of experience in the academic world as students
                    and teachers, we have seen the benefits of 1-on-1, in-person
                    learning to maximize student outcomes and educational
                    experiences. However, multiple challenges exist for students
                    in the current learning landscape. Time spent traveling,
                    fitting sessions into busy schedules outside of normal
                    homework hours, and the inability to provide help outside of
                    appointments are some of the many obstacles students face.
                    To overcome these challenges, we utilize mobile technology
                    to connect with our students any time they need help, no
                    scheduling required!
                  </p>
                  <p>
                    We are PhD candidates studying Neuroscience at Washington
                    University in St. Louis. On campus, we are fortunate each
                    day to be around the brightest minds in the world in the
                    fields of math, science, and engineering. As PhD students
                    and degree holders, these talented individuals have been
                    trained in best teaching practices, as teaching
                    assistantships are required in all PhD graduate programs.
                    Not only are these people insanely smart, but they have also
                    been trained to communicate difficult concepts in the
                    classroom. We want all students to be connected with this
                    amazing network of academics. With high quality tutors
                    available at the click of a button, we believe Pocket PhDs
                    services will get students exactly what they need: quick
                    access to experts who are masters in the subjects of their
                    schoolwork.
                  </p>
                  <p>Happy Learning!</p>
                  <p>
                    <b> Wade Self and Alex Russo </b>, Co-Founders of Pocket
                    PhDs
                  </p>
                </div>
              </Col>

              <Col>
                {/* Images of wade and alex with short bio and resumes */}
                <div>
                  <img src={wade} alt="Wade + Pam" height="200" />
                  <br />
                  Wade with his mom (and first tutor), Pam
                  <br />
                  <a href="https://storage.googleapis.com/wzukusers/user-22198339/documents/572a2d27670afTKUqSWW/Resume_Wade%20Self.pdf">
                    Wade's Resume
                  </a>
                </div>
                <br />
                <br />

                <div>
                  <img src={alex} alt="Alex + Liz" height="200" />
                  <br />
                  Alex with her mom (and first tutor), Liz
                  <br />
                  <a href="https://storage.googleapis.com/wzukusers/user-22198339/documents/572b604cc4ef0oiu6Oi4/Resume_Alex%20Russo.pdf">
                    Alex's Resume
                  </a>
                </div>
              </Col>
            </Row>
          </Jumbotron>
          <div style={{ textAlign: 'left' }}>
            <Jumbotron>
              <p className="display-4">Our Experts</p>

              <hr className="my-3" />
              <Carousel
                pause="hover"
                interval="10000"
                activeIndex={this.state.activeIndex}
                next={this.next}
                previous={this.previous}
              >
                <CarouselIndicators
                  items={experts}
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
              <center>
                <p>"{experts[this.state.activeIndex].quote}"</p>
                <p>{experts[this.state.activeIndex].about}</p>
              </center>
            </Jumbotron>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
