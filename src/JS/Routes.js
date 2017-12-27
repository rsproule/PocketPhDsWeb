import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import NavLink from './navlink.js';
import '../CSS/navbar.css';
import plogo from '../Logos/PocketPhDsLogo(no_text).JPG';
import fire from './firebase.js';

// helper bootstap guys 
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//routes:
import Home from './RoutePages/Home.js'
import Login from './RoutePages/Login.js';
import Register from './RoutePages/Register.js';
import Account from './RoutePages/Account.js';
import Class from './RoutePages/Class.js';
import CreateClass from './RoutePages/CreateClass.js'




const HowItWorks = () => (
  <div>
    How it works
  </div>
)

const Experts = () => (
  <div> 
    Our Experts
  </div>
)

const Pricing = () => (
  <div> 
    pricing
  </div>
)

const FAQ = () => (
  <div> 
    FAQ
  </div>
)

const Contact = () => (
  <div> 
    contact
  </div>
)

const EditAccount = () => (
  <div> 
    Edit the account here
  </div>
)



const PrivateRoute = ({ component: Component, ...rest, auth, loading }) => (
  <Route {...rest} render={props => {
    if(!loading){
      return (
          fire.auth().currentUser   ?  (
            <Component {...props}/>
          ) : (
            <Redirect to={{ 
              pathname: '/login',
              state: { from: props.location }
            }}/>
          )
    )
  }else{
    return (
      <div>
        <div> Fetching User Data... </div>
        <div className="spacer"></div>
      </div>
      );
  }
  }}/>
)



class Routes extends Component {
  
  constructor(props){
    super(props);
    let isFirefox = this.determineIfFirefox()
    this.state = {
        dropdownOpen : false,
        loadingUser : true,
        isFirefox : isFirefox
    }
  }

  
  determineIfFirefox(){
    let f = navigator.userAgent.search("Firefox");
    return (f > -1);
  }

  toggle(){
    this.setState({
      dropdownOpen : !this.state.dropdownOpen
    })
  }


  logout(){
    fire.auth().signOut().then( () => {
      // Sign-out successful.
      this.setState({
        'isLoggedIn' : false
      })

    }).catch(function(error) {
      // An error happened.
      alert("Error Logging Out: " + error.message)
    });
  }


 

  componentWillMount(){
    var currUser = fire.auth().currentUser;

    if (currUser) {
      // User is signed in.
        this.setState({
          'isLoggedIn' : true,

        })
    }else{

        this.setState({
          'isLoggedIn' : false,

        })
    }
  }

   componentDidMount(){

    this.setState({
        unsubscribe : fire.auth().onAuthStateChanged( (user) => {

          // alert("auth state change")
          if (user) {
            // User is signed in.
            this.setState({
              isLoggedIn : true,
              loadingUser: false
            })
          } else {
            // No user is signed in.
            this.setState({
              isLoggedIn : false,
              loadingUser: false
            })
          }
        })

    })
    


    // this is checking the local storage instance because there 
    // is a delay before the actual fire auth is initialized 
     for (let key in localStorage) {
        if (key.startsWith("firebase:authUser:")) {
            let json = JSON.parse(localStorage[key])


             this.setState({
                isLoggedIn : true,
                defaultInitials : json['displayName'].substring(0, 2).toUpperCase()
             })
        }
    }
  }

  componentWillUnmount(){
    // should remove all observers here, or else we will have mem leak
    this.state.unsubscribe()
  }


  

  render(){
    return (
      <Router>
        
          <div className="navigation">
            <ul>
              <div>
                <li><NavLink className="logo" to="/">   <img src={plogo} alt="Home" width="50"/> </NavLink></li>
              </div>

              <div>
                <li><NavLink to="/how-it-works">How it Works</NavLink></li> 
                <li><NavLink to="/pricing">Pricing</NavLink></li>
                <li><NavLink to="/experts">Our Experts</NavLink></li>
                <li><NavLink to="/faq">FAQ</NavLink></li>
                <li><NavLink to="/contact">Contact</NavLink></li>
              </div>

              <div className="login-nav">
              {!this.state.isLoggedIn? 
                <span>
                  <li><NavLink to="/login">Login</NavLink></li>
                  <li ><Link className="register" to="/register">Create an Account</Link></li>
                </span>
              :
                <span className="menu-btn-li">


                  <li ><div className="dropdown-wrapper">
                  <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggle()} >
                    <DropdownToggle caret>
                       {
                          fire.auth().currentUser
                           ?
                          fire.auth().currentUser.displayName.substring(0, 2).toUpperCase()
                            :
                          this.state.defaultInitials
                       }
                    </DropdownToggle>
                    <DropdownMenu right>
                    {
                      // have to check dynamically if this is firefox becuase firefox
                      // gets confused by the dropdown item wrapper
                      this.state.isFirefox
                         ? 
                         <span>
                        <NavLink className="drop" to='/account'> View Profile </NavLink>
                        <NavLink className="drop" to='/edit-profile'> Edit Profile Info </NavLink>
                        </span>
                        :
                        <span>
                        <DropdownItem><NavLink className="drop" to='/account'> View Profile </NavLink></DropdownItem>
                        <DropdownItem> <NavLink className="drop" to='/edit-profile'> Edit Profile Info </NavLink></DropdownItem>
                        </span>
                    }
                      <DropdownItem className="drop" onClick={() => this.logout()} >Log Out</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                

                  </div></li>


              
                </span> 
              }


              </div>

            </ul>
            <br/> <br/> <br/>
            <hr/>

          
            <Route exact path="/" component={Home}/>
            <Route path="/how-it-works" component={HowItWorks}/>
            <Route path="/experts" component={Experts}/>
            <Route path="/pricing" component={Pricing}/>
            <Route path="/faq" component={FAQ}/>
            <Route path="/contact" component={Contact}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>

              {/* These are the secure routes that should require user to be authenticated */}
            <PrivateRoute auth={this.state.isLoggedIn} loading={this.state.loadingUser} path="/account" component={Account}/>
            <PrivateRoute auth={this.state.isLoggedIn} loading={this.state.loadingUser}  path="/edit-profile" component={EditAccount}/>
            <PrivateRoute auth={this.state.isLoggedIn} loading={this.state.loadingUser}  path="/class/:classid" component={Class}/>
            <PrivateRoute auth={this.state.isLoggedIn} loading={this.state.loadingUser}  path="/create-class" component={CreateClass}/>

          
        </div>
      </Router>
    );
  }
}




export default Routes;