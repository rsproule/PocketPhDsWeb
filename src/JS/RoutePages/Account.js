import React, {Component} from 'react';
import fire from '../firebase.js';
import {Redirect, Link} from 'react-router-dom';
import '../../CSS/account.css';
import ClassList from './ClassList.js';

import {Container, Row, Col, Badge, Tooltip, Button } from 'reactstrap';


export default class Account extends Component{
	
	constructor(props){
		super(props)
		this.state = {
			logout : false,
			unsubscribe: null,

			//user info
			name : 'Loading...',
			email : 'Loading...',
			school : null,
			profile_url : null,
			classes : {},

			//meta
			loaded : false,


			tooltipOpen : false
		}
	}

	logout(){
		fire.auth().signOut().then( () => {
		  // Sign-out successful.
			fire.database().ref('users/' + fire.auth().currentUser.uid).off();

		  this.setState({
		  	'logout' : true
		  })

		}).catch(function(error) {
		  // An error happened.
		  alert("Error Logging Out: " + error.message)
		});
	}


	editProfile(){
		//reroute to the edit profile page
		this.setState({
			editProfile : true 
		});
	}


	componentDidMount(){
		// we need this listener in case the local storage of the firebase instance is destroyed
		// while we are still on the user page and need to reroute back to secure place
		this.setState({
			unsubscribe : fire.auth().onAuthStateChanged( (user) => {
		      // alert("auth state change")
		      if (user) {
		      	
		      		fire.database().ref('users/' + fire.auth().currentUser.uid).on('value', (snap) => {
		      			let name = snap.val().name;
		      			let email = snap.val().email;
		      			let schoolName = snap.val().school;
		      			let classes = snap.val().classes;
		      			let profile_url = snap.val().profile;
		      			let bio = snap.val().bio;

		      			this.setState({
		      				name : name,
		      				email : email,
		      				school : schoolName,
		      				classes : classes,
		      				profile_url : profile_url,
		      				bio : bio,

		      				loaded : true 
		      			});

		      		})
		      	

		        // User is signed in.
		        this.setState({
		          logout : false
		        })



		      } else {
		        // No user is signed in.
		        this.setState({
		          logout : true
		        })
		      }
		    })
		})
		
	}

	componentWillUnmount(){
		// remove observer, no memory leaks
		this.state.unsubscribe();
		if(fire.auth().currentUser){
			fire.database().ref('users/' + fire.auth().currentUser.uid).off();

		}
	}


	toggleTooltip(){
		this.setState({
	      tooltipOpen: !this.state.tooltipOpen
	    });
	}


	setPasswordEmail(){
		console.log('triggered')
		fire.auth().sendPasswordResetEmail('rsproule23@gmail.com').then(()=>{
			console.log("sendPasswordResetEmail")
		}).catch((error) => {
			console.log(error)
		})
	}

	render(){
		

		return(
			<div>
				{ 
					// need to make sure we have this guy before we do anything 
					this.state.loaded ? 
					<div className="clearfix">
						<div className="header-account clearfix">
								<Row>
									<Col className="left-align">
										
										<span className="avatar">
											{
												this.state.profile_url != null
												?
												<img src={this.state.profile_url} alt="profile_img"/>
												:
												this.state.name.substring(0, 2).toUpperCase()
											}
										</span>

										<span className="display-name">

											{this.state.name}

										</span>			
										<br/>

										<b>E-mail: </b>{this.state.email} &nbsp;
										{
											fire.auth().currentUser.emailVerified
												?
											<Badge color="success">Verified</Badge>
												:
											<span>
												<Badge color="danger" id='verify'>Email NOT Verified</Badge>
												<Tooltip placement="right"
												 isOpen={this.state.tooltipOpen}
												 target="verify" 
												 toggle={this.toggleTooltip.bind(this)}>
										        	Follow link in email to verify
										        </Tooltip>
									        </span>

										}
									</Col>

									<Col className="left-align">	
										<b>School: </b>{this.state.school}<br/><br/>
										<b> Bio: </b>  {this.state.bio}



									</Col>


									<Col className="right-align">
										<div className="edit-info" >
											<Link to="/edit-profile" className="edit">
											<img 
											 src="https://image.flaticon.com/icons/png/512/7/7706.png"
											  alt="Edit PNG" width="32" height="32"
											/>

											<br/>

											Edit Account Info
											</Link>
											<br/>

										</div>
									</Col>
								</Row>

						</div>




						<div className="account-tabs">
							<a className="activeTab">
								Classes
							</a>	
							<a>
								Other
							</a>			
						</div>
						<Button onClick={() => this.setPasswordEmail()}> Send Set Password </Button>
						<ClassList classes={this.state.classes}/>

					</div>
					:
					<div>
						<center> Loading... </center>

						<div className="spacer">
						</div>
					</div>


				}
				
			</div>
		);
	}
}















