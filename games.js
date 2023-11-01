console.log('hello worlid');



// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
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






var myPlayerNumber = 0;







// Get the playerId from sessionStorage
const playerId = sessionStorage.getItem('playerId');
console.log(playerId);

// Get a reference to the HTML element where you want to display the player's name
const playerNameDisplay = document.getElementById("playerNameDisplay");

// Get a reference to the player's data in the database
const playerRef = ref(db, `players/${playerId}`);

// Use the get method to fetch the player's data
get(playerRef)
  .then((snapshot) => {
    const playerData = snapshot.val();
    const playerName = playerData ? playerData.username : "Player Not Found";
    playerNameDisplay.textContent = playerName;
    console.log(playerNameDisplay.textContent);
    console.log(playerData.email);
    console.log('myPlayerNumber:', playerData.PlayerNumber);  
    console.log('Player.uid:', playerId); 
  });

document.addEventListener("DOMContentLoaded", function () {
    const charactersContainer = document.querySelector(".characters");
    const chosenCardContainer = document.getElementById("chosenCard");
    const acceptButton = document.getElementById("acceptButton");
  
    let selectedCard = null;
    let acceptedCard = null;
    let cardAccepted = false; // Track whether a card has been accepted
    let charactersData = []; // Array to hold character data
  
    // Initially hide the "Accept" button
    acceptButton.style.display = "none";
  
    // Function to handle card selection
    function handleCardSelection(imageName, characterName) {
        if (!cardAccepted) {
            if (selectedCard !== imageName) {
                if (selectedCard) {
                    const previousCard = document.getElementById(selectedCard);
                    previousCard.classList.remove("selected");
                }
  
                selectedCard = imageName;
  
                const selectedImage = document.createElement("img");
                selectedImage.src = `images/${imageName}.jpg`;
                selectedImage.alt = characterName;
  
                chosenCardContainer.innerHTML = "";
                chosenCardContainer.appendChild(selectedImage);
  
                const characterCard = document.getElementById(imageName);
                characterCard.classList.add("selected");
                acceptButton.style.display = "block"; // Show the "Accept" button
            }
        }
    }
  
    // Function to toggle opacity
    function toggleCardOpacity(imageName) {
        if (cardAccepted) {
            const characterCard = document.getElementById(imageName);
            const currentOpacity = window.getComputedStyle(characterCard).opacity;
            const newOpacity = currentOpacity === "1" ? "0.5" : "1";
            characterCard.style.opacity = newOpacity;
        }
    }
  
    // Load names from JSON file
    fetch("name.json")
        .then((response) => response.json())
        .then((data) => {
            charactersData = data;
  
            // Log the JSON data to the console
            console.log(data);
  
            // Create character cards
            for (const imageName in charactersData) {
                const characterName = charactersData[imageName];
  
                const characterCard = document.createElement("div");
                characterCard.className = "character-card";
                characterCard.id = imageName;
  
                // Create character image
                const characterImage = document.createElement("img");
                characterImage.src = `images/${imageName}.jpg`;
                characterImage.alt = characterName;
  
                // Create paragraph for displaying character name
                const characterNameParagraph = document.createElement("p");
                characterNameParagraph.textContent = characterName;
  
                // Append character image and name paragraph to the card
                characterCard.appendChild(characterImage);
                characterCard.appendChild(characterNameParagraph);
  
                // Append the character card to the container
                charactersContainer.appendChild(characterCard);
  
                // Add event listener for card selection
                characterCard.addEventListener("click", () => {
                    handleCardSelection(imageName, characterName);
                });
  
                // Add event listener for opacity toggle
                characterCard.addEventListener("click", () => {
                    toggleCardOpacity(imageName);
                });
            }
        })
        .catch((error) => console.error(error));
  
    // Event listener for "Accept" button
    acceptButton.addEventListener("click", () => {
        if (selectedCard) {
            const characterName = charactersData[selectedCard];
            alert(`You have accepted ${characterName}`);
            acceptedCard = selectedCard;
            cardAccepted = true; // Mark the card as accepted
            acceptButton.style.display = "none"; // Hide the "Accept" button
            
            // Remove the event listener for character card selection
            const characterCard = document.getElementById(selectedCard);
            characterCard.removeEventListener("click", () => {
                handleCardSelection(selectedCard, characterName);
            });
        }
    });
  });