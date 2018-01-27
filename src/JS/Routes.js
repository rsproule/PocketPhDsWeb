import '../CSS/navbar.css';

import plogo from '../Logos/PocketPhDsLogo(no_text).JPG';
import { fire } from './firebase.js';
import NavLink from './navlink.js';
import Account from './RoutePages/Account.js';
import AddTutor from './RoutePages/AddTutor.js';
import Class from './RoutePages/Class.js';
import CreateClass from './RoutePages/CreateClass.js';
import CreateModule from './RoutePages/CreateModule.js';
// import AssignTutor from './RoutePages/AssignTutor.js';
import EditAccount from './RoutePages/EditProfile.js';
import ChangeSubscription from './RoutePages/ChangeSubscription.js';
import HowItWorks from './RoutePages/HowItWorks.js';
import Experts from './RoutePages/Experts.js';
import FAQ from './RoutePages/FAQ.js';
import Contact from './RoutePages/Contact.js';
import TutorList from './RoutePages/TutorList.js';
import ModuleList from './RoutePages/ModuleList.js';
//routes:
import Home from './RoutePages/Home.js';
import Login from './RoutePages/Login.js';
import Register from './RoutePages/Register.js';
import React, { Component } from 'react';
import {
  Link,
  Redirect,
  Route,
  BrowserRouter as Router
} from 'react-router-dom';
// helper bootstap guys
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';

const PrivateRoute = ({ component: Component, auth, loading, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (!loading) {
        return fire.auth().currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        );
      } else {
        return (
          <div>
            <div> Fetching User Data... </div>
            <div className="spacer" />
          </div>
        );
      }
    }}
  />
);

const AdminRoute = ({ component: Component, auth, loading, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        const { from } = props.location.state || {
          from: { pathname: '/login' }
        };

        if (!loading) {
          return fire.auth().currentUser ? (
            fire.auth().currentUser.uid === '62NYU9arTleg2awTsWdUqdLzizD2' ? (
              <Component {...props} />
            ) : (
              <Redirect to={from} />
            )
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        } else {
          return (
            <div>
              <div> Fetching User Data... </div>
              <div className="spacer" />
            </div>
          );
        }
      }}
    />
  );
};

class Routes extends Component {
  constructor(props) {
    super(props);
    let isFirefox = this.determineIfFirefox();
    this.state = {
      dropdownOpen: false,
      menuOpen: false,
      loadingUser: true,
      isFirefox: isFirefox
    };
  }

  determineIfFirefox() {
    let f = navigator.userAgent.search('Firefox');
    return f > -1;
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  logout() {
    fire
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        this.setState({
          isLoggedIn: false
        });
      })
      .catch(function(error) {
        // An error happened.
        alert('Error Logging Out: ' + error.message);
      });
  }

  componentWillMount() {
    var currUser = fire.auth().currentUser;

    if (currUser) {
      // User is signed in.
      this.setState({
        isLoggedIn: true
      });
    } else {
      this.setState({
        isLoggedIn: false
      });
    }
  }

  componentDidMount() {
    this.setState({
      unsubscribe: fire.auth().onAuthStateChanged(user => {
        // alert("auth state change")
        if (user) {
          // User is signed in.
          this.setState({
            isLoggedIn: true,
            loadingUser: false
          });
        } else {
          // No user is signed in.
          this.setState({
            isLoggedIn: false,
            loadingUser: false
          });
        }
      })
    });

    // this is checking the local storage instance because there
    // is a delay before the actual fire auth is initialized
    for (let key in localStorage) {
      if (key.startsWith('firebase:authUser:')) {
        let json = JSON.parse(localStorage[key]);

        this.setState({
          isLoggedIn: true,
          defaultInitials: json['email'].substring(0, 2).toUpperCase()
        });
      }
    }
  }

  componentWillUnmount() {
    // should remove all observers here, or else we will have mem leak
    this.state.unsubscribe();
  }

  render() {
    var navItems = [
      <NavLink className="logo" to="/">
        {' '}
        <img src={plogo} alt="Home" width="50" />{' '}
      </NavLink>,

      <NavLink to="/how-it-works">How it Works</NavLink>,
      <NavLink to="/experts">Our Experts</NavLink>,
      <NavLink to="/faq">FAQ</NavLink>,
      <NavLink to="/contact-us">Contact</NavLink>
    ];

    return (
      <Router>
        <div>
          <div className="navigation">
            <ul>
              {/* <div className="logo-nav">
                <li>
                {navItems[0]}
                </li>
              </div> */}

              <div className="nav-items-dropdown">
                <Dropdown
                  isOpen={this.state.menuOpen}
                  toggle={() => this.toggleMenu()}
                >
                  <DropdownToggle>Menu</DropdownToggle>
                  <DropdownMenu>
                    {navItems.map((item, i) => {
                      if (this.state.isFirefox) {
                        return { item };
                      }
                      if (i === 0) {
                        // the image with the link

                        return (
                          <DropdownItem className="dropdown-menu-item" key={i}>
                            {item} Home
                          </DropdownItem>
                        );
                      }
                      return (
                        <DropdownItem className="dropdown-menu-item" key={i}>
                          {item}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>
              </div>

              <div className="nav-items-bar">
                <span>
                  {navItems.map((item, i) => {
                    return <li key={i}>{item}</li>;
                  })}
                </span>
              </div>

              <div className="login-nav">
                {!this.state.isLoggedIn ? (
                  <span>
                    <li>
                      <NavLink to="/login">Login</NavLink>
                    </li>
                    <li>
                      <Link className="register" to="/register">
                        Create an Account
                      </Link>
                    </li>
                  </span>
                ) : (
                  <span className="menu-btn-li">
                    <li>
                      <div className="dropdown-wrapper">
                        <Dropdown
                          isOpen={this.state.dropdownOpen}
                          toggle={() => this.toggle()}
                        >
                          <DropdownToggle caret>
                            {this.state.loadingUser
                              ? '...'
                              : fire.auth().currentUser
                                ? fire.auth().currentUser.displayName
                                  ? fire
                                      .auth()
                                      .currentUser.displayName.substring(0, 2)
                                      .toUpperCase()
                                  : fire
                                      .auth()
                                      .currentUser.email.substring(0, 2)
                                      .toUpperCase()
                                : this.state.defaultInitials}
                          </DropdownToggle>
                          <DropdownMenu right>
                            {// have to check dynamically if this is firefox becuase firefox
                            // gets confused by the dropdown item wrapper
                            this.state.isFirefox ? (
                              <span>
                                <NavLink className="drop" to="/account">
                                  {' '}
                                  View Profile{' '}
                                </NavLink>
                                <NavLink className="drop" to="/edit-profile">
                                  {' '}
                                  Edit Profile Info{' '}
                                </NavLink>
                              </span>
                            ) : (
                              <span>
                                <DropdownItem>
                                  <NavLink className="drop" to="/account">
                                    {' '}
                                    View Profile{' '}
                                  </NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                  {' '}
                                  <NavLink className="drop" to="/edit-profile">
                                    {' '}
                                    Edit Profile Info{' '}
                                  </NavLink>
                                </DropdownItem>
                              </span>
                            )}
                            <DropdownItem
                              className="drop"
                              onClick={() => this.logout()}
                            >
                              Log Out
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </li>
                  </span>
                )}
              </div>
            </ul>
          </div>
          <br /> <br /> <br />
          <hr />
          <Route exact path="/" component={Home} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/experts" component={Experts} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact-us" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          {/* These are the secure routes that should require user to be authenticated */}
          <PrivateRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/account"
            component={Account}
          />
          <PrivateRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/edit-profile"
            component={EditAccount}
          />
          <PrivateRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/class/:classid"
            component={Class}
          />
          <PrivateRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/create-class"
            component={CreateClass}
          />
          <AdminRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/account/add-tutor"
            component={AddTutor}
          />
          <AdminRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/account/create-module"
            component={CreateModule}
          />
          {/* <AdminRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/account/assign-tutor"
            component={AssignTutor}
          /> */}
          <AdminRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/account/change-subscription"
            component={ChangeSubscription}
          />
          <AdminRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/account/tutors"
            component={TutorList}
          />
          <AdminRoute
            auth={this.state.isLoggedIn}
            loading={this.state.loadingUser}
            path="/account/modules"
            component={ModuleList}
          />
        </div>
      </Router>
    );
  }
}

export default Routes;
