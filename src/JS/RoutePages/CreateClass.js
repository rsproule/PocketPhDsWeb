import React, {Component} from 'react';
import '../../CSS/createClass.css';
import Link from 'valuelink';
import fire from '../firebase.js';

//bootstrap
import { Button, Form, FormGroup, Label, Input, FormText, Card, Jumbotron, Alert, Row, Col } from 'reactstrap';


export default class CreateClass extends Component{

	constructor(props){
		super(props);

		this.state = {

			shouldShowErrors : false,
			className : '',
			students : [
				{
					name : '',
					email_student : '',
					email_parent : ''
				}
			]

		};

	}

	addStudent(){
		this.setState({
      		students: this.state.students.concat([{
      			name: '',
      			email_student: '',
      			email_parent : ''
      		}])
    	});
	}

	removeStudent(idx){
		this.setState({
	      students: this.state.students.filter((s, sidx) => idx !== sidx)
	    });
	}

	submit(classNameLink, studentLink){
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		// make sure all of the students are valid 
		// all UI stuff is checked on the lower level this is a 
		// second check thast is doing the same thing but it has teh ability to 
		// change control flow in the parent component
		var studentsContainErrors = false;
		studentLink.map((studentLink, i)=> {
			const nameLink = studentLink.at('name')
				.check(x => x, "Students Name is Required")
			

			const emailLink1 = studentLink.at('email_student')
				.check(x => x, 'Email is Required')
		        .check(x => x.match(re), 'Must be a valid E-mail Address (you@domain.com)');

		    const emailLink2 = studentLink.at('email_parent')
				.check(x => x, 'Email is Required')
		        .check(x => x.match(re), 'Must be a valid E-mail Address (you@domain.com)');

			
			studentsContainErrors = (nameLink.error || emailLink1.error || emailLink2.error)
		})

		
		 //make sure the form is all good
        if(classNameLink.error || studentsContainErrors){
            this.setState({
                shouldShowErrors : true,
            });
            return;
        }



        console.log("good to upload")

       	// send emails to all the students to invite them to join the class: 
       	//  complete registration and download the app



       	// upload the class to firebase in the teachers name
        var newClassRef = fire.database().ref('/classes/').push({
        	name : this.state.className,
        	teacher : fire.auth().currentUser.uid,
        	
        });

        let newClassId = newClassRef.key;
		
	}

	resendVerificationEmail(){
		if(fire.auth().currentUser.emailVerified)
			return;

		 // send the verification email
        fire.auth().currentUser.sendEmailVerification().then( () => {
          // Email sent.
          this.setState({
          	verificationSent : true
          })
        }).catch(function(error) {
          // An error happened.
          this.setState({
          	verificationError : true
          })
        });
	}
	

	render(){
		const classNameLink = Link.state(this, 'className')
			.check(x => x, "Class name is required");
		const studentLink = Link.state(this, 'students');

		var isEmailVerified = fire.auth().currentUser.emailVerified;

		if(isEmailVerified){

			return(

				<div className="create-class-wrapper">
					<Card>
						<div className="create-class-form">
							
								<Form>
									<FormGroup>
										<Label for="className"> Class Name </Label>
										<div className="error-message">
					             			{this.state.shouldShowErrors ? classNameLink.error || '' : ''}
					      				</div>
										<Input 
											value={classNameLink.value}
											onChange={(e) => {classNameLink.set(e.target.value)}} 
											type="text" id="className" 
											placeholder="Enter the class name."
										/>
									</FormGroup>
									<h4> Students: </h4>

									{
										studentLink.map((studentLink, idx) => (
												// the jsx for each student elem
												<div key={idx} className="student-wrapper">
													<StudentInput 
														deleteStudent={()=>this.removeStudent(idx)}
														studentLink={studentLink}
														shouldShowErrors = {this.state.shouldShowErrors}
													/>
												</div>
											)
										)
									}
									<div className="add-student-btn">
										<Button color='primary' onClick={() => this.addStudent()}> Add Student </Button>
									</div>
								</Form>


						</div>
					</Card>
					<br/>
					<Button color='primary' onClick={ () => this.submit(classNameLink, studentLink) }> Create Class </Button>
				</div>

			);

		} else{
			// email has not been verified
			return (
				<div>
					 <Jumbotron>
				        <h1 className="display-3">Email not Verified</h1>
				        <p className="lead">For security reasons, you must have a verified email with Pocket PhDs in order to create a class.</p>
				        <hr className="my-2" />
				        <p> Verifying your email is a simple as following a link in the verification email we sent you </p>
				        <p className="lead">
				          <Button color="primary">Resend Verification E-mail</Button><br/><br/>
				          {
				          	this.state.verificationSent
				          		?
				          	<Alert color="success"  className="float-right">
					        	Verification E-mail sent successfully - Refresh the Page
					      	</Alert>
					      		: ''
					      }
					      {
					      	this.state.verificationError 
					      		? 
					      	<Alert color="danger" className="float-right">
						        Error Sending Verification E-mail - Check that you have a valid E-mail
						    </Alert>
						    	:  ''
				          }
				        </p>
				      </Jumbotron>
				</div>
			)
		}
	}
}



const StudentInput = ({studentLink, deleteStudent, shouldShowErrors}) => {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const nameLink = studentLink.at('name')
		.check(x => x, "Students Name is Required")
		

	const emailLink1 = studentLink.at('email_student')
		.check(x => x, 'Student Email is Required')
        .check(x => x.match(re), 'Must be a valid E-mail Address (you@domain.com)');

    const emailLink2 = studentLink.at('email_parent')
		.check(x => x, 'Parent Email is Required')
        .check(x => x.match(re), 'Must be a valid E-mail Address (you@domain.com)');


	return (
		<Card>
			<div className="student-input">
				<Row>
					<Col>
					<FormGroup>
						<Label> Student Name </Label>
						<div className="error-message">
	             			{shouldShowErrors ? nameLink.error || '' : ''}
	      				</div>
						<Input onChange={(e) => nameLink.set(e.target.value)} value={nameLink.value} type="text" placeholder="Enter the student's name."/>
					</FormGroup>
					</Col>
				</Row>

				<Row>
					<Col>
						<FormGroup>
							<Label> Student E-mail Address </Label>
							<div className="error-message">
		             			{shouldShowErrors ? emailLink1.error || '' : ''}
		      				</div>
							<Input onChange={(e) => emailLink1.set(e.target.value)} value={emailLink1.value} type="email" placeholder="Enter the student's E-mail address."/>
						</FormGroup>
					</Col>

					<Col>
						<FormGroup>
							<Label> Parent E-mail Address </Label>
							<div className="error-message">
		             			{shouldShowErrors ? emailLink2.error || '' : ''}
		      				</div>
							<Input onChange={(e) => emailLink2.set(e.target.value)} value={emailLink2.value} type="email" placeholder="Enter the parent's E-mail address."/>
						</FormGroup>
					</Col>
				</Row>
				<Button onClick={()=>{deleteStudent()}} className="float-right" color='danger'> Delete </Button>
			</div>
		</Card>
	);
	

}











