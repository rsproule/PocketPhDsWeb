import firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyB84LNj_S1HZxDYHxMMr1w6h85mqpGhSTk',
  authDomain: 'pocket-phds.firebaseapp.com',
  databaseURL: 'https://pocket-phds.firebaseio.com',
  projectId: 'pocket-phds',
  storageBucket: 'pocket-phds.appspot.com',
  messagingSenderId: '548424482224'
};
var fire = firebase.initializeApp(config);
export default fire;
