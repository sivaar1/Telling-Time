var players = [];
var playerPts;
var currentPIndex;
var levelNum;
var numQuestions;

//Adds minute markers to the clock
function addMarkers(){
	var tempDeg;
	for(var i = 0; i < 60; i++){
		tempDeg = i*6;
		var mark = document.createElement("DIV");
		mark.style.position = "absolute";
		if(i%5 == 0){
			mark.style.width = "4px";
			mark.style.marginLeft = "-2px";
		}
		else{
			mark.style.width = "2px";
			mark.style.marginLeft = "-1px";
		}
		mark.style.height = "100%";
		mark.style.top = "0%";
		mark.style.left = "50%";
		mark.style.backgroundColor = "black";
		mark.style.transform = "rotate(" + tempDeg + "deg)";
		document.getElementById("clock").appendChild(mark);
	}
}

//The first new game when you open the html file
function initGame(){
	alert("Welcome to the Telling Time Game!\nThere are three levels, each having five questions.\nEach level will be more difficult than the last, but you will be rewarded more points. Good Luck!");
	newPlayer();
}

//Starts a new game when a user either logs in or signs up. Initializes global variables such as levelNum and numQuestions
function newGame(){
	//Gives functionality to the submit button
	document.getElementById("usrButton").setAttribute("onclick", "getAnswer()");
	levelNum = 1;
	numQuestions = 0;
	alert("Level 1");
	changeClock();
}

//Signifies the end of the game. Function will display the player's score and save it if it is the best one they have.
function endGame(){
	alert("You have completed the game!\nYour total score is " + playerPts + "!");
	if(playerPts > players[currentPIndex].numPoints)
		players[currentPIndex].numPoints = playerPts;
	//Add code to take away functionality of submit button
	document.getElementById("usrButton").setAttribute("onclick", "");
}

//Sorts player array from highest amount of points to lowest
function compareObj(x, y){
	if (x.numPoints > y.numPoints)
		return -1;
	if (x.numPoints < y.numPoints)
		return 1;
	return 0;
}

//Gets the name of the player from the array of objects with the given index.
function getName(index){
	var name = "";
	var tempObj = players[index];
	var str = JSON.stringify(tempObj);
	
	//Taking out everything but the name
	str = str.replace("{\"firstName\":\"", "");
	str = str.replace("\",\"lastName\":\"", " ");
	str = str.replace(/".+/,"");
	
	return str;
}

//Presents all the users' scores in a table that lists the name and points. It is sorted from highest to lowest points.
function getData(){
	//Makes sure there isn't an ongoing game.
	if(numQuestions == 16){
		var adminPass = prompt("Please enter the password","");
		if(adminPass == "hello"){
			players.sort(compareObj);
			var myTable = document.createElement('table');
			for(var i = 0; i < players.length; i++){
				var tempRow = myTable.insertRow(i);
				var tempName = getName(i);
				var cell1 = tempRow.insertCell(0);
				cell1.innerHTML = tempName;
				var cell2 = tempRow.insertCell(1);
				cell2.innerHTML = players[i].numPoints;
			}
			var tempBody = document.body;
			tempBody.innerHTML = "";
			var title = document.createElement("H1");
			var titleTxt = document.createTextNode("Student Scores");
			title.appendChild(titleTxt);
			tempBody.appendChild(title);
			tempBody.appendChild(myTable);
		}
		else
			alert("Incorrect Password!")
	}
	else
		alert("Finish current game before retrieving scores!")
}

//Prompts the user for information to create an account in order to play the game.
function newPlayer(){
	//Makes sure there isn't an ongoing game.
	if(numQuestions != 16 && players.length > 0){
		alert("Please finish current game before signing up!");
		return;
	}
	var fName, lName, pKey;
	//Loop will make sure none of the fields are blank
	do{
		fName = prompt("Please enter your first name.");
		lName = prompt("Please enter your last name.");
		pKey = prompt("Please enter a password.");
		if(fName.replace(/\s/g,"") == "" || lName.replace(/\s/g,"") == "" || pKey.replace(/\s/g,"") == "")
			alert("One or more of the fields were blank. Please fill out everything.");
		else
			break;
	}while(1);
	//Checks if player already has an account
	for(var i = 0; i < players.length; i++){
		if(players[i].firstName == fName && players[i].lastName == lName){
			alert("That player already exists!");
			return;
		}
	}
	var tempPlayer = {firstName: fName, lastName: lName, playerPass: pKey, numPoints: 0};
	currentPIndex = players.push(tempPlayer) - 1;
	playerPts = 0;
	newGame();
}

function existPlayer(){
	//Makes sure there isn't an ongoing game.
	if(numQuestions != 16){
		alert("Please finish current game before logging in!");
		return;
	}
	var fName, lName, pKey;
	//Loop will make sure none of the fields are blank
	do{
		fName = prompt("Please enter your first name.");
		lName = prompt("Please enter your last name.");
		pKey = prompt("Please enter your password.");
		if(fName.replace(/\s/g,"") == "" || lName.replace(/\s/g,"") == "" || pKey.replace(/\s/g,"") == "")
			alert("One or more of the fields were blank. Please fill out everything.");
		else
			break;
	}while(1);
	//Searches through array of objects to find player.
	for(var i = 0; i < players.length; i++){
		if(players[i].firstName == fName && players[i].lastName == lName && players[i].playerPass == pKey){
			currentPIndex = i;
			playerPts = 0;
			newGame();
			return;
		}
	}
	alert("Invalid Information!");
}

//Gets the user's answer in the input boxes when they click submit.
function getAnswer(){
	
	//Gets the user input
	var usrHr = document.getElementById("answer").getElementsByTagName("input")[0].value;
	var usrMin = document.getElementById("answer").getElementsByTagName("input")[1].value;
	
	//Gets the actual hours and mins
	var tempHr = document.getElementById("hrHand").style.transform;
	var clockHr = Math.floor(tempHr.replace(/[^0-9.]/g, "") / 30);
	var tempMin = document.getElementById("minHand").style.transform;
	var clockMin = (tempMin.replace(/[^0-9.]/g, "") / 30) * 5;
	
	//For a specific case when the min hand is on 12
	if(clockMin == 60)
		clockMin = 0;
	
	//Checks if answer is right or wrong
	var alertStr;
	if(usrHr == clockHr && usrMin == clockMin){
		playerPts += 10*levelNum;
		alertStr = "Correct! +" + 10*levelNum + " points";
	}
	else
		alertStr = "Wrong!";
	alert(alertStr);
	
	//Refreshes the input box
	document.getElementById("answer").getElementsByTagName("input")[0].value = "";
	document.getElementById("answer").getElementsByTagName("input")[1].value = "";
	changeClock();
}

//Randomizes the clock after the user submits their answer. Clock will change in certain ways depending on levelNum.
function changeClock(){
	
	//Checks if game is done.
	if(checkLevel()){
		endGame();
		return;
	}
	
	var tempHr = randomHand();
	var tempMin = randomHand();
	var hrDeg = tempHr * 30;
	var minDeg = tempMin * 30;
	
	//Randomizes the clock hands based on levelNum
	if(levelNum == 1)
		minDeg = 360;
	else if(levelNum == 2){
		if(tempMin != 12)
			hrDeg += tempMin * 2.5;
	}
	else if(levelNum == 3){
		tempMin = randomHand2();
		minDeg = tempMin * 6;
		if(tempMin != 60)
			hrDeg += tempMin * 0.5;
	}
	
	//Sets the clock hand transformations
	document.getElementById("hrHand").style.transform = "rotate(" + hrDeg + "deg)";
	document.getElementById("minHand").style.transform = "rotate(" + minDeg + "deg)";
}

//Returns 1 if game is over, otherwise set the current level and returns 0
function checkLevel(){
	numQuestions++;
	if(numQuestions == 16)
		return 1;
	else {
		if(numQuestions > 10){
			if(numQuestions == 11)
				alert("Level 3");
			levelNum = 3;
		}
		else if(numQuestions > 5){
			if(numQuestions == 6)
				alert("Level 2");
			levelNum = 2;
		}
		return 0;
	}
}

//Randomly returns an int between 1 to 12, both inclusive.
function randomHand(){
	return Math.floor(Math.random() * (12 - 1 + 1)) + 1;
}

//Randomly returns an int between 1 to 60, both inclusive.
function randomHand2(){
	return Math.floor(Math.random() * (60 - 1 + 1)) + 1;
}