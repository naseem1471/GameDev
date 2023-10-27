console.log('hello world');


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFimP-R_PDw8YKIcVeCmjevBIE-nPDZmU",
  authDomain: "naseem-akbar.firebaseapp.com",
  databaseURL: "https://naseem-akbar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "naseem-akbar",
  storageBucket: "naseem-akbar.appspot.com",
  messagingSenderId: "804593419200",
  appId: "1:804593419200:web:564f1605dfc36080f7be25"
};

// Initialize Firebase apps
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

// Define the username variable outside of the event listeners
let username;


// Game variables
let playerId;
let players = [];
let numPlayers = 0;
let myColor;



// Define mainDiv outside of any function
const mainDiv = document.querySelector(".main");

var myPlayerNumber = 0;

// Function to add a player to the players array
function addPlayer(playerId) {
  players.push({ playerId: playerId });
}

// Your handleNumPlayersUpdate function
function handleNumPlayersUpdate() {
  console.log("Outside onValue callback - numPlayers:", numPlayers);

  // If the game is full (numPlayers is 2),
  if (numPlayers === 2) //&& (myPlayerNumber === 1 || myPlayerNumber === 2)) 
  {
    setTimeout(() => {
      // Redirect to "games.html" for the first and second player--
      mainDiv.style.display = "none";
      window.location.href = "games.html";
    }, 3000); // 3,000 milliseconds (3 seconds)
  }

  // Check if numPlayers is 3 and remove the third player
  if (players.length === 3) {
    setTimeout(() => {
      //document.body.style.backgroundColor = "black";
      

      // Log the players array
      //console.log("players array:", players);

    }, 1000); // 1,000 milliseconds (1 second)
    // Redirect to index.html
    window.location.href = "index.html";
  }
}

// Sign up users
const signupForm = document.querySelector('.SIGNUP');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;
  username = signupForm.username.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      console.log('User created:', credentials.user.uid);
      signupForm.reset();
    })
    .catch(err => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector('.LOGIN');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      console.log('User logged in:', credentials.user.uid);
      const user = credentials.user;
      playerId = user.uid;

      // Store the playerId in sessionStorage
      sessionStorage.setItem('playerId', playerId);

      // Increment myPlayerNumber and set the user data in the database
      myPlayerNumber = numPlayers + 1; // Increment myPlayerNumber here
      set(ref(db, 'players/' + playerId), {
        myPlayerNumber: myPlayerNumber,
        username: username,
        email: email
        // Add any other user data you want to store
      })
        .then(() => {
          console.log('User data has been set in the database');
          console.log('myPlayerNumber:', myPlayerNumber);

          // Retrieve playerId values from Firebase database
          const playersRef = ref(db, 'players');
          onValue(playersRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
              // Extract player data into an array
              const players = Object.entries(data).map(([playerId, data]) => ({
                playerId,
                ...data,
              }));

              // Log the player data array
              console.log("Player Data:", players);

              // Now you have an array of player data objects
            }
          });
        })
        .catch((error) => {
          console.error('Error setting user data:', error);
        });
    })
    .catch((error) => {
      console.error('Error signing in:', error);
    });
});

onValue(ref(db, 'players'), (snapshot) => {
  players = snapshot.val() || {};
  Object.keys(players).forEach((key) => {
    const characterState = players[key];
    numPlayers = Object.keys(players).length;
    console.log("Inside onValue callback - numPlayers:", numPlayers);

    handleNumPlayersUpdate();
  });
});

console.log('myPlayerNumber:', myPlayerNumber);
