console.log('hello world');


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
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
// Declare  in the outer scope
let players = [];
let playerId;
let numberOfPlayers = 0; // Declare numberOfPlayers in a higher scope


// Define mainDiv outside of any function
const mainDiv = document.querySelector(".main");

// Sign up users form
const signupForm = document.querySelector('.SIGNUP');

// ... (previous code)

// Inside your signupForm event listener
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;
  username = signupForm.username.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      console.log('User created:', credentials.user.uid);
      playerId = credentials.user.uid;

      // Store the playerId in sessionStorage
      sessionStorage.setItem('playerId', playerId);
      signupForm.reset();

      // Add the player to the database
      const playerRef = ref(db, 'activeUsers/' + playerId);
      return set(playerRef, {
        username,
        // Add any other player data you want to store
      });
    })
    .then(() => {
      // Successfully added player to the database
    })
    .catch((error) => {
      console.error("Error creating user:", error);
    });

  // Close the createUser function and then, after the createUser is complete, run the get database function
  setTimeout(() => {
    // Retrieve the list of all users from the database after the createUser is complete
    const playersRef = ref(db, 'activeUsers');
    get(playersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const playersData = snapshot.val();
          if (playersData) {
            // Update your players array with the data from the database
            players = Object.keys(playersData);
            // Find out how many playerId entries there are in the database
            const numberOfPlayers = players.length;
            console.log(`Number of players in the active (non-players) database: ${numberOfPlayers}`);

            // Check if numberOfPlayers is greater than or equal to 3
            if (numberOfPlayers >= 3) {
              // Take action to restrict access
              console.log('Too many players. Access restricted.');
              // Show an alert popup to notify players
              window.alert('Too many players. Access restricted.');
              // Hide .mainDiv (assuming .mainDiv is a DOM element)
              mainDiv.style.display = 'none';
              return; // Exit the function to stop further code execution
            }

          } else {
            players = [];
            console.log("No players found in the database.");
          }
        } else {
          console.log("No players found in the database.");
        }
      })
      .catch((error) => {
        console.error("Error fetching players from the database:", error);
      });
  }, 2000); // 2000 milliseconds (2 seconds) delay
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

    // Retrieve the list of all users from the database after the createUser is complete
    const playersRef = ref(db, 'activeUsers');
    get(playersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const playersData = snapshot.val();
          if (playersData) {
            // Update your players array with the data from the database
            players = Object.keys(playersData);
            // Find out how many playerId entries there are in the database
            const numberOfPlayers = players.length;
            console.log(`Number of players in the database players: ${numberOfPlayers}`);

            // Set the user data in the database
            let myPlayerNumber = numberOfPlayers;
            set(ref(db, 'players/' + playerId), {
              PlayerNumber: myPlayerNumber,
              username: username,
              email: email
              // Add any other user data you want to store
            })
              .then(() => {
                console.log('User data has been set in the database');

                // Redirect to games.html if numberOfPlayers is 1 or 2
                if (numberOfPlayers === 1 || numberOfPlayers === 2) {
                  window.location.href = 'games.html';
                }
              })
              .catch((error) => {
                console.error('Error setting user data in the database:', error);
              });
          }
        } else {
          players = [];
          console.log("No players found in the database.");
        }
      })
      .catch((error) => {
        console.error("Error fetching players from the database:", error);
      });
  })
  .catch((error) => {
    console.error('Error logging in:', error);
  });
    })
