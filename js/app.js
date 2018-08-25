//let Variables
let firstClick = true,
	hours,
	minutes,
	seconds,
	rateHTML = "",
    rateStep = 6,
	totalTime = 0,
	currentOpenedCards = [],
	matchedCards = [],
	incrementer,
	moves = 0;

//const Variables
const 	cardList = ["fa fa-diamond",
			"fa fa-paper-plane-o",
			"fa fa-anchor",
			"fa fa-bolt",
			"fa fa-cube",
			"fa fa-leaf",
			"fa fa-bicycle",
			"fa fa-bomb",
			"fa fa-diamond",
			"fa fa-paper-plane-o",
			"fa fa-anchor",
			"fa fa-bolt",
			"fa fa-cube",
			"fa fa-leaf",
			"fa fa-bicycle",
			"fa fa-bomb"],
		deck = document.querySelector(".deck"),
		deckOfCards = deck.children,
		hoursContainer = document.querySelector("#hours"),
		minutesContainer = document.querySelector("#minutes"),
		secondsContainer = document.querySelector("#seconds"),
		movesContainer = document.querySelector(".moves"),
		totalMoves = document.querySelector("#total-moves"),
		exactMoves = cardList.length / 2,
		maxStars = exactMoves + rateStep,
		minStars = exactMoves + ( 2 * rateStep),
		star    = document.querySelectorAll(".star"),
		totalHours = document.querySelector("#totalHours"),
		totalMinutes = document.querySelector("#totalMinutes"),
		totalSeconds = document.querySelector("#totalSeconds"),
		rateContainer = document.querySelector("#total-rate"),
		repeatBtn = document.querySelector(".restart .play-again"),
      	repeatBtnFromModal = document.querySelector(".modal .play-again"),
		modal = document.querySelector(".modal");

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Create a list that holds all of your cards
 */
function createShuffledCardsGrid() {
	// shuffle the given array of cards
	const shuffledCards = shuffle(cardList);

	//create a document fragment for better performance
	const cardsFragment = document.createDocumentFragment();

	//loop through the shuffled list to create the grid
	for (let cardCreater = 0; cardCreater < shuffledCards.length; cardCreater++) {
		let eachCard = document.createElement("li");
		eachCard.innerHTML = `<i class = "${shuffledCards[cardCreater]}"></i>`;
		cardsFragment.appendChild(eachCard);
	}
	deck.appendChild(cardsFragment);
}

//start the game logic here
function playGame() {
	//loop through the clicks and cards
	for (let clickCounter = 0; clickCounter < deckOfCards.length; clickCounter++) {

		//invoke click functionality
		deckOfCards[clickCounter].addEventListener("click", function () {
			//start timer on first click
			if (firstClick) {
				startTimer();
				firstClick = false;
			}

			//save current card clicked and previous one
			const previousCard = currentOpenedCards[0];
			const currentCard = this;

			if (currentOpenedCards.length === 1) {
				//open and disable current card
				currentCard.className = "show open disabled";
				//add current card to currentOpenedCards array
				currentOpenedCards.push(currentCard);
				//check if previousCard and currentCard match
				isMatched(currentCard, previousCard);
				//empty the currentOpenedCards array after comparism
				currentOpenedCards = [];
				//increment the move count
				movesCounter();
				// Change the rating
                rating();
			}else{
				//open and disable current card
				currentCard.className = "show open disabled";
				//add current card to currentOpenedCards array
				currentOpenedCards.push(currentCard);
			}
		});
	}
}

//Star Rating
function rating() {
    // This condition below relies on the value of `maxStars` & `minStars` variables
    if(moves < maxStars) {
        rateHTML = "<i class='star fa fa-star'></i><i class='star fa fa-star'></i><i class='star fa fa-star'></i></br><h2>You did a great job!</h2>";
    } else if(moves < minStars) {
        star[2].style.color = "#444";
        rateHTML = "<i class='star fa fa-star'></i><i class='star fa fa-star'></i><br><h2>You can do better!</h2>";
    } else {
        star[1].style.color = "#444";
        rateHTML = "<i class='star fa fa-star'></i><br><h2>You lost... Try again please!</h2>";
    }
}

//moves function
function movesCounter() {	
	moves++;
	movesContainer.innerHTML = moves;
}

//matching or comparism function
function isMatched(currentCard, previousCard) {
	if (previousCard.innerHTML === currentCard.innerHTML) {
		//change the to matched state
		currentCard.className = "match disabled";
		previousCard.className = "match disabled";
		//move matched cards into matchedCards array
		matchedCards.push(currentCard,previousCard);
		//check if the game is over
		isGameOver();
	}else{
		//show both cards for a while and flip them back
		setTimeout(function () {
			currentCard.className = "card";
			previousCard.className = "card";
		}, 500);
	}
}

//game over function
function isGameOver() {
	if (cardList.length === matchedCards.length) {
		gameOverMessege();
	}
}

//game over message here
function gameOverMessege() {
	//display the modal
	modal.style.top = "0";
	//add moves
	totalMoves.innerHTML = moves + 1;
	// Add Rate
    rateContainer.innerHTML = rateHTML;
	//stop Timer
	stopTimer();
	//set the HTML content using the values from calculateTime()
	totalHours.innerHTML = hours;
	totalMinutes.innerHTML = minutes;
	totalSeconds.innerHTML = seconds;
}

//stop the timer here
function stopTimer() {
	//clear the setInterval function
	clearInterval(incrementer);
}

//start the timer here
function startTimer() {
	//set a time interval of one mili sec
	incrementer = setInterval(function() {
		//start time from 1 sec
		totalTime += 1;
		//convert from sec to minutes and hours
		calculateTime();
		//update the time containers afer every mili sec
		secondsContainer.innerHTML = seconds;
		minutesContainer.innerHTML = minutes;
		hoursContainer.innerHTML = hours;
	}, 1000);
}

//calculating the time from the total time 
function calculateTime() {
	hours = Math.floor(totalTime / 60 / 60);
	minutes = Math.floor((totalTime / 60) % 60);
	seconds = totalTime % 60;
}


//Playing the game
function  game(){
	//shuffle the cards
	createShuffledCardsGrid();
	//fire the click function and play the game
	playGame();
}

//starting the game for the first time
game();

//reset game here
//with the repeat button
repeatBtn.addEventListener("click", function() {
    // Start the game again
    repeat();
});

//with the modal button
repeatBtnFromModal.addEventListener("click", function () {
    // Hide the modal
    modal.style.top = "-200%";
    // Start the game again
    repeat();
});

//Repeat Game
function repeat() {
    // Remove all cards, as they will get rebuild again 
    deck.innerHTML = "";
    // Reset Current Values
    resetValues();
    // Start the game again
    game();
}

//reset all values to default
function resetValues() {
    matchedCards = [];
    currentOpenedCards = [];
    moves = 0;
    movesContainer.innerHTML = "--";
    star[1].style.color = "#ffb400";
    star[2].style.color = "#ffb400";
    rateHTML = "";
    hoursContainer.innerHTML = "00";
    minutesContainer.innerHTML = "00";
    secondsContainer.innerHTML = "00";
    stopTimer();
    firstClick = false;
    totalTime = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
}