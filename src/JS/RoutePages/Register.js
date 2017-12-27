import React, { Component } from 'react';
import '../../CSS/register.css';
import {Redirect} from 'react-router-dom';
import Link from 'valuelink';
import {Input} from 'valuelink/lib/tags';
import fire from '../firebase.js';





// wrapper for form inputs that also will show error state
const FormInput = ({label, shouldShowErrors, ...props}) => (
    <div>
        <label> {label} </label>
        <div className="error-message">
             {shouldShowErrors ? props.valueLink.error || '' : ''}
        </div>
        <Input {...props} />
        
    </div>
);



/*  
    Register Component:
        email and password registrstion form 
        managaes state of inputs with dual state data binding from valueLink

*/
export default class Register extends Component{

    constructor(props) {
        super(props);
        this.state = {
                email : '',
                pswd1 : '',
                pswd2 : '',
                shouldShowErrors: false,
                redirect : false,
                accountId : '',
                serverError: ''
        };
    }
       

    onSubmit(containsError){
        //make sure the form is all good
        if(containsError){
            this.setState({
                shouldShowErrors : true,
            });
            return;
        }

        // try to register the user 
        var registerSuccessful = true;
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.pswd1)
          .catch( (error) =>  {
                registerSuccessful = false;
                this.setState({
                    shouldShowErrors : true,
                    serverError: error.message
                 });
        }).then(()=>{
            if (registerSuccessful) {

                // set default display name to email prefix
                fire.auth().currentUser.updateProfile({
                    displayName : this.state.email.substring(0, this.state.email.indexOf("@"))
                })




                // send the verification email
                fire.auth().currentUser.sendEmailVerification().then( () => {
                  // Email sent.
                }).catch(function(error) {
                  // An error happened.
                });


                // add this user to the database

                fire.database().ref('users/' + fire.auth.currentUser.uid).set({
                    'name' : fire.auth().currentUser.displayName,
                    'email' : this.state.email,
                    'school' : '',
                    'classes' : {},
                    
                });

                
                // this will force render to be called again this time with the redirect triggered
                this.setState({
                     redirect : true,
                     accountId : fire.auth().currentUser.uid,
                })
            }

        })


        
        
    }

    render(){

        if(this.state.redirect){
            return <Redirect to={"account/" + this.state.accountId}/>
        }

        // email regular expression... tested against 10,000 emails 100% success rate... still not sure 
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        const emailLink = Link.state(this, 'email')
            .check( x => x, 'Email is Required')
            .check(x => x.match(re), 'Must be a valid E-mail Address');

        const pswd1Link = Link.state(this, 'pswd1')
            .check(x => x.length >= 8, 'Password must be at least 8 characters')

        const pswd2Link = Link.state(this, 'pswd2')
            .check(x => x === this.state.pswd1, 'Passwords must match')

       


    	return(
            <div className="register">
                <div>
                    <h2> Welcome to Pocket PhDs! </h2>
                    <p>
                        Create an account to create classes and monitor your students progress.
                    </p>
                </div>

                <div className="register-form"> 

                        <FormInput label="E-mail" shouldShowErrors={this.state.shouldShowErrors} type="text"
                         placeholder="you@domain.com" id="email" required valueLink={emailLink}
                        />
                        
                        <FormInput label="Password" shouldShowErrors={this.state.shouldShowErrors} type="password"
                         placeholder="Enter Password" required valueLink={pswd1Link}
                        />

                        <FormInput label="Confirm Password" shouldShowErrors={this.state.shouldShowErrors} type="password" 
                        placeholder="Enter Password" required valueLink={pswd2Link}
                        />

                        <div className="error-message">
                            {this.state.serverError}
                         </div>

                        <button onClick={ () => this.onSubmit(emailLink.error || pswd1Link.error || pswd2Link.error) } type="submit">
                            Create your Account 
                        </button>
                </div>
            </div>
        );
    }
}
