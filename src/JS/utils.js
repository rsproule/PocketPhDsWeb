import { fire, initSecondary } from './firebase.js';

/**
 * promise returns: an array of objects that map student id's to the associated parent id
 */
var registerAllStudents = ({ students }) => {
  return new Promise((resolve, reject) => {
    var promiseArray = [];
    var students_id_array = [];
    var secondaryFire = initSecondary();

    // TODO: send emails to all the students to invite them to join the class:
    //  complete registration and download the app
    for (var student in students) {
      student = students[student];
      // create the student
      console.log(student);
      promiseArray.push(
        createUser({
          email: student.email_student,
          type: 'student',
          name: student.name,
          secondaryFire: secondaryFire
        })
          .then(student_id => {
            //create the parent

            return createUser({
              email: student.email_parent,
              type: 'parent',
              student_id: student_id,
              secondaryFire: secondaryFire
            })
              .then(parent_id => {
                let parent_student_id_obj = {
                  student: student_id,
                  parent: parent_id
                };
                students_id_array.push(parent_student_id_obj);
              })
              .catch(error => {
                //  alert(error);
                reject(error);
              });
          })
          .catch(error => {
            reject(error);
          })
      );
    }

    Promise.all(promiseArray)
      .then(() => {
        console.log(students_id_array);
        secondaryFire.delete(); // not sure if this is necessary
        resolve(students_id_array);
      })
      .catch(error => alert(error));
  });
};

var createUser = ({ type, email, name, student_id = 0, secondaryFire }) => {
  return new Promise((resolve, reject) => {
    //generate random password by converting random number to base 36, then concat
    // two of them together to get a 12 character string
    var password1 =
      Math.random()
        .toString(36)
        .substr(2, 8) +
      Math.random()
        .toString(36)
        .substr(2, 8);

    // create an account for the student
    secondaryFire
      .auth()
      .createUserWithEmailAndPassword(email, password1)
      .then(userAuth => {
        //user was successfully created, now send them email to set passcode/verify Account
        secondaryFire
          .auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            // secondaryFire.auth().signOut();
            uploadUserToDatabase({
              userAuth: userAuth,
              email: email,
              type: type,
              name: name,
              student_id: student_id
            }).then(id => {
              resolve(id);
            });
          });
      })
      .catch(error => {
        // TODO: in case where email is already in use we should do something else
        if (error === 'auth/email-already-in-use') {
          //continue;
          alert(error);
        }
        reject(error);
      });
  });
};

function getId(userAuth) {
  // HACK: There is an upcoming update that will make the promise
  // return a AuthUser instead of a User. When that happens the
  // if statement should resolve true and still work fine
  return userAuth.user ? userAuth.user.uid : userAuth.uid;
}

var uploadUserToDatabase = ({ userAuth, email, student_id, type, name }) => {
  return new Promise((resolve, reject) => {
    let id = getId(userAuth);
    if (type === 'parent') {
      let parentRef = fire.database().ref('/users/' + id);
      // check if the parent already is out here
      parentRef.once('value', snap => {
        // check if the parent is already there
        // if it is only update the student column
        if (snap.val()) {
          var students = snap.val().students;
          students[student_id] = true;

          parentRef
            .update({
              students: students
            })
            .then(() => {
              resolve(id);
            });
        }

        // if the parent doesnt alreadt exist :
        var s = {};
        s[student_id] = true;
        parentRef
          .set({
            type: type,
            student: s,
            email: email,
            name: 'Parent of ' + name
          })
          .then(() => {
            resolve(id);
          });
      });
    } else {
      //create chat for student
      var chatRef = fire
        .database()
        .ref('chats')
        .push({
          name: 'Brain Coach Chat',
          lastMessage: 'Welcome to Pocket Phds',
          timestamp: +new Date(),
          image: 'http://52.14.73.202/~rsproule/pocketPhDsLogo.png'
        })
        .then(chatSnap => {
          // add user to the database
          fire
            .database()
            .ref('/users/' + id)
            .set({
              type: type,
              email: email,
              chat: chatSnap.key,
              name: name,
              classes: {}
            })
            .then(() => {
              resolve(id);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    }
  });
};

export { registerAllStudents };
