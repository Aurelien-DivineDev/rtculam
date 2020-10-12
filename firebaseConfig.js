
const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyAs-0tuOqdYpjLQGsAtr5FDydmWYM8V0pk",
  authDomain: "rtcdemo-d9384.firebaseapp.com",
  databaseURL: "https://rtcdemo-d9384.firebaseio.com",
  projectId: "rtcdemo-d9384",
  storageBucket: "rtcdemo-d9384.appspot.com",
  messagingSenderId: "456872632340",
  appId: "1:456872632340:web:355f9881305b824dfcc701"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = {
	db: firebase.firestore()
};