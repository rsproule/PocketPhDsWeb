import { fire, initSecondary } from './firebase.js';

var createClass = ({ className, teacherId, students }) => {
  return new Promise((resolve, reject) => {
    registerAllStudents({ students: students }).then(
      students_parents_id_array => {
        // upload the class to firebase in the teachers name
        console.log(students_parents_id_array);
        return fire
          .database()
          .ref('/classes/')
          .push({
            name: className,
            teacher: fire.auth().currentUser.uid,
            // HACK: This here is a little map reduce to get the student array
            // to be in the form students : {{id : true}, {id2 : true}} just
            // stare at it for a min and it will make sense
            students: students_parents_id_array
              .map(stud_par => {
                var o = {};
                o[stud_par['student']] = true;
                return o;
              })
              .reduce((result, item) => {
                var key = Object.keys(item)[0]; //first property:  id
                result[key] = item[key]; // assign the second property: true
                return result;
              }, {})
          })
          .then(classSnap => {
            console.log('here');
            console.log(students_parents_id_array);
            let newClassId = classSnap.key;
            var allStudentsPromises = [];
            // give the teacher the class
            allStudentsPromises.push(
              fire
                .database()
                .ref(
                  '/users/' +
                    fire.auth().currentUser.uid +
                    '/classes/' +
                    newClassId
                )
                .set(true)
            );
            // give each student+parent the class + create chat for student with tutor
            for (let i in students_parents_id_array) {
              let stud_id = students_parents_id_array[i]['student'];
              let parent_id = students_parents_id_array[i]['parent'];
              //set the student to have the class... parent gets it by transitivity
              allStudentsPromises.push(
                fire
                  .database()
                  .ref('/users/' + stud_id + '/classes/' + newClassId)
                  .set(true)
              );
            }
            return Promise.all(allStudentsPromises).then(resolve);
          })
          .catch(error => reject(error));
      }
    );
  });
};

/**
 * promise returns: an array of objects that map student id's to the associated parent id
 */
var registerAllStudents = ({ students }) => {
  return new Promise((resolveReg, rejectReg) => {
    var promiseArray = [];
    var students_id_array = [];
    var secondaryFire = initSecondary();

    // TODO: send emails to all the students to invite them to join the class:
    //  complete registration and download the app
    for (var student in students) {
      student = students[student];
      promiseArray.push(
        //create the student
        createStudent({
          student: student,
          secondaryFire: secondaryFire
        })
          .then(({ student_id, student }) => {
            console.log(student_id);
            return uploadStudentToDatabase({
              student: student,
              student_id: student_id
            });
          })
          .then(({ student_id, student }) => {
            //create the parent
            return createParent({
              student: student,
              student_id: student_id,
              secondaryFire: secondaryFire
            });
          })
          .then(({ student_id, student, parent_id }) => {
            return uploadParentToDatabase({
              student: student,
              student_id: student_id,
              parent_id: parent_id
            });
          })
          .then(({ student_id, parent_id }) => {
            var m = {
              student: student_id,
              parent: parent_id
            };
            return m;
          })
      );
    }
    return Promise.all(promiseArray)
      .then(res => {
        secondaryFire.delete(); // not sure if this is necessary... it is :)
        var student_parent_arr = [];
        res.forEach(r => {
          // TODO: create a map of the {student_id : parent_id}
          student_parent_arr.push(r);
        });
        // TODO: resolve with the map or array whatever
        resolveReg(student_parent_arr);
      })
      .catch(error => alert(error));
  });
};

var createStudent = ({ student, secondaryFire }) => {
  return new Promise((resolve, reject) => {
    //generate random password by converting random number to base 36, then concat
    // two of them together to get a 12 character string
    var password =
      Math.random()
        .toString(36)
        .substr(2, 8) +
      Math.random()
        .toString(36)
        .substr(2, 8);
    //
    // create an account for the student
    //
    return secondaryFire
      .auth()
      .createUserWithEmailAndPassword(student.email_student, password)
      .then(userAuth => {
        //user was successfully created, now send them email to set passcode/verify Account
        secondaryFire.auth().sendPasswordResetEmail(student.email_student);
        resolve({ student_id: getId(userAuth), student: student });
      })
      .catch(error => {
        // TODO: in case where email is already in use we should do something else
        if (error === 'auth/email-already-in-use') {
          //continue;
          alert(error + ' -> ' + student.email_student);
          secondaryFire.delete();
          //          resolve({id : getId(userAuth), student : student})
        }
        reject(error);
      });
  });
};

var createParent = ({ student_id, student, secondaryFire }) => {
  return new Promise((resolve, reject) => {
    //generate random password by converting random number to base 36, then concat
    // two of them together to get a 12 character string
    var password =
      Math.random()
        .toString(36)
        .substr(2, 8) +
      Math.random()
        .toString(36)
        .substr(2, 8);
    //
    // create an account for the student
    //
    return secondaryFire
      .auth()
      .createUserWithEmailAndPassword(student.email_parent, password)
      .then(userAuth => {
        //user was successfully created, now send them email to set passcode/verify Account
        secondaryFire.auth().sendPasswordResetEmail(student.email_parent);
        resolve({
          parent_id: getId(userAuth),
          student: student,
          student_id: student_id
        });
      })
      .catch(error => {
        // TODO: in case where email is already in use we should do something else
        if (error === 'auth/email-already-in-use') {
          //continue;
          alert(error + ' -> ' + student.email_parent);
          secondaryFire.delete();
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

var uploadStudentToDatabase = ({ student, student_id }) => {
  return new Promise((resolveUpload, rejectUpload) => {
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
        console.log(student);
        return fire
          .database()
          .ref('/users/' + student_id)
          .set({
            type: 'student',
            email: student.email_student,
            chat: chatSnap.key,
            name: student.name,
            classes: {},
            // give them the starter module
            modules: {
              module1: {
                description: 'Welcome to Pocket PhDs',
                isUnlocked: true,
                name: 'Module 1',
                nextModule: 'module2',
                videoWatched: false,
                quizTaken: false
              }
            }
          });
      })
      .then(() => {
        resolveUpload({ student_id: student_id, student: student });
      })
      .catch(error => {
        rejectUpload(error);
      });
  });
};

var uploadParentToDatabase = ({ student_id, parent_id, student }) => {
  return new Promise((res, rej) => {
    let parentRef = fire.database().ref('/users/' + parent_id);
    // check if the parent already is out here
    parentRef.once('value', snap => {
      // check if the parent is already there
      // if it is only update the student column
      if (snap.val()) {
        var studentsMap = snap.val().students;
        studentsMap[student_id] = true;
        return parentRef.update({ students: studentsMap }).then(() => {
          res({ student_id: student_id, parent_id: parent_id });
        });
      }

      // if the parent doesnt alreadt exist :
      var s = {};
      s[student_id] = true;
      return parentRef
        .set({
          type: 'parent',
          student: s,
          email: student.email_parent,
          name: 'Parent of ' + student.name
        })
        .then(() => {
          res({ student_id: student_id, parent_id: parent_id });
        })
        .catch(error => rej(error));
    });
  });
};

export { createClass };
