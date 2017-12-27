import fire from './firebase.js';



/*
	This function is fired once after the user pressed the register button
	the function 
	1 checks to see that all the spaces are filled with the correct data
	2 serializes the data into json
	3 uploads the data to the database.

*/
export function register_user(callback) {
	// Account:
	var email =  document.getElementById('email').value;
	var pass1 = document.getElementById('password1').value;
	var pass2 = document.getElementById('password2').value;
	
	//personal
	var first_name = document.getElementById('first_name').value;
	var last_name = document.getElementById('last_name').value;
	var school_name = document.getElementById('school_name').value;
	var teacher_name = document.getElementById('teacher_name').value;
	var grade = document.getElementById('grade').value;
	var reason = document.getElementById('reason').value;

	// parent info 
	var parent_name = document.getElementById('parent_name').value;
	var parent_email = document.getElementById('parent_email').value;
	var parent_phone = document.getElementById('parent_phone').value;


	var data = {
		"email": email,
		"password": pass1,

		"first_name" : first_name,
		"last_name" : last_name, 
		"school_name" : school_name,
		"teacher_name" : teacher_name, 
		"grade" : grade,
		"reason" : reason, 

		// parent info 
		"parent_name" : parent_name,
	 	"parent_email" : parent_email, 
		"parent_phone" : parent_phone,

		"type" : "student"
	}


	//console.log(data);

	var database = fire.database().ref();
	var userKey = database.child('users').push().key
	var parentKey = database.child('users').push().key;

	var updates = {};

	// posting to users. users gets all the data except obv gotta hash the password
	updates['/users/' + userKey] = data;

	//parent created 
	updates['/users/' + parentKey] = {
		"student" : userKey,
		"name" : parent_name,
		"email" : parent_email,
		"phone" : parent_phone,
		"type" : "parent"
	};

	//add tp students array
	updates['/students/' + userKey] = {
		"parent" : parentKey,
	};

	//add to parents array 
	updates['/parents/' + parentKey] = {
		"student" : userKey,
		"name" : parent_name,
		"email" : parent_email,
		"phone" : parent_phone,
	};

	database.update(updates);
	alert("Registration Successful!")

}



/*
	This function is responsible for checking if all the data is
	present and non problematic

	@returns a boolean stating whether there is a problem with the field
*/
function check_register_fields(args){

}

