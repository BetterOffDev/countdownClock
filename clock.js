// variables to be edited by client
// 
var isDST = true;
var holidays = ['May 28, 2015', 'July 4, 2015'];
var closeTime = 16;
var closeEarlyTime = 14;


// do not edit below this point!
// 
// 
var holidaysUTC = convertHolidaysToUTC(holidays);
var clientDate = new Date();
var clientUTC = convertToUTC(clientDate);


var setVariables = function() {
	var currentESTDate = convertToEST(isDST, clientUTC);
	var currentESTTime = Math.floor(new Date(currentESTDate).getTime());
	var isDayBeforeHoliday = checkIfDayBeforeHoliday(clientUTC, holidaysUTC);
	if (isDayBeforeHoliday) {
		closeTime = closeEarlyTime;
	}
	var currentESTCloseTime = new Date(currentESTDate).setHours(closeTime,0,0,0);
	return {
        currentESTDate: currentESTDate,
        currentESTTime: currentESTTime,
        currentESTCloseTime: currentESTCloseTime
    };  
}


function convertHolidaysToUTC(holidays) {
	var holidaysUTC = [];
	for (var i = 0; i < holidays.length; i++) {
	    holidaysUTC.push(Date.parse(holidays[i]));
	}
	return holidaysUTC;
}

function convertToUTC() {
	var dateInput = new Date();
    var utc = dateInput.getTime() + (dateInput.getTimezoneOffset() * 60000);
    return utc;
}

function checkIfHoliday(clientUTC, holidaysUTC) {
	var isHoliday = false;
	for (var i = 0; i < holidaysUTC.length; i++) {
		if ( clientUTC >= holidaysUTC[i] && clientUTC < (holidaysUTC[i] + 86400000) ) {
			isHoliday = true;
			break;
		}
	}
	return isHoliday;
}

function checkIfDayBeforeHoliday(clientUTC, holidayUTC) {
	//currentESTCloseTime = new Date(currentESTDate).setHours(closeTime,0,0,0);
	var isDayBeforeHoliday = false;
	for (var i = 0; i < holidaysUTC.length; i++) {
		var nextDay = clientUTC + 86400000;
		if ( nextDay >= holidaysUTC[i] ) {
			isDayBeforeHoliday = true;
			break;
		}
	}
	return isDayBeforeHoliday;
}

function checkIfOpenDay() {
	var isOpen = true;
	var dayOfWeek = new Date().getDay();
	if ( dayOfWeek == 0 || dayOfWeek == 6 ) {
		isOpen = false;
	}
	return isOpen;
}

// convert date to EST
function convertToEST(isDST, clientUTC) {

	var offset, clientDate, utc, serverDate;

    //EST
    if ( isDST === true ) {
    	offset = -4.0;
    }
    else {
    	offset = -5.0
    }

    serverDate = new Date(clientUTC + (3600000*offset));

    return serverDate;


}

function getHoursLeft(currentESTCloseTime, currentESTTime) {
	var hoursLeft;
	hoursLeft = currentESTCloseTime - currentESTTime;
	hoursLeft = hoursLeft / 3600000;
	if (hoursLeft < 1) {
		return 0;
	}
	else {
		return Math.floor(hoursLeft);
	}
}

function getMinutesLeft(currentESTCloseTime, currentESTTime) {
	var hours;
	var difference = currentESTCloseTime - currentESTTime;
	var hours = difference / 3600000;
	var roundedHours = Math.floor(hours);
	var minutes = (difference/(1000*60))%60;
	if (hours >= 1) {
		var totalMinutes = hours * 60;
		var hoursRemoved = totalMinutes - (roundedHours * 60);
		// var minutesLeft = totalMinutes - (roundedHours * 60);
		// minutesLeft = 60 - minutesLeft;
		var minutesLeft = Math.floor(minutes);
	}
	else {
		minutesLeft = hours * 60;
		minutesLeft = Math.floor(minutes);
	}
	
	if (Math.floor(minutes) < 1) {
		return 0;
	}
	else {
		return Math.floor(minutes);
	}
}

var initClock = function() {

	// order of operations
	// 
	// 1. check if today is a holiday 
	var isHoliday = checkIfHoliday(clientUTC, holidaysUTC)

	
	// 2. check if the store is open (not Saturday or Sunday)
	var isOpenDay = checkIfOpenDay()

	// 3. check if it's after business hours
	var isClosed = false;
	if ( initVariables.currentESTTime > initVariables.currentESTCloseTime) {
		isClosed = true;
	}

	// 4. if it's a holiday OR it's a closed day, don't display the clock
	if ( isHoliday || !isOpenDay || isClosed ) {
		document.getElementById("countdownClock").style.display = "none";
		document.getElementById("closed").style.display = "block";
	}

	// 5. Set whether minutes/minute and hours/hours is displayed
	var hourText = 'hour and';
	if ( getHoursLeft(initVariables.currentESTCloseTime, initVariables.currentESTTime) > 1 ) {
		hourText = 'hours and';
	}
	if ( getHoursLeft(initVariables.currentESTCloseTime, initVariables.currentESTTime) < 1 ) {
		hourText = '';
	}
	document.getElementById("hourText").innerHTML = hourText;

	var minuteText = 'minute';
	if ( getMinutesLeft(initVariables.currentESTCloseTime, initVariables.currentESTTime) > 1 ) {
		minuteText = 'minutes';
	}
	document.getElementById("minuteText").innerHTML = minuteText;

	// 6. Since we have a clock, let's update the hours and minutes
	if ( getHoursLeft(initVariables.currentESTCloseTime, initVariables.currentESTTime) != 0 ) {
		document.getElementById("clockHours").innerHTML = getHoursLeft(initVariables.currentESTCloseTime, initVariables.currentESTTime);
	}
	document.getElementById("clockMinutes").innerHTML = getMinutesLeft(initVariables.currentESTCloseTime, initVariables.currentESTTime);

}

var initVariables = setVariables();
initClock();
setInterval(function() {

	var clientDate = new Date();
	var clientUTC = convertToUTC(clientDate);
	var isHoliday = checkIfHoliday(clientUTC, holidaysUTC);
	var isOpenDay = checkIfOpenDay();

	if ( isHoliday || !isOpenDay || initVariables.currentESTCloseTime < initVariables.currentESTTime ) {
		document.getElementById("countdownClock").style.display = "none";
		document.getElementById("closed").style.display = "block";
	}

	var currentMin = document.getElementById("clockMinutes").innerHTML;
	var currentHours = document.getElementById("clockHours").innerHTML;
	var newMin = currentMin - 1;
	if (newMin > 0) {
		document.getElementById("clockMinutes").innerHTML = newMin;
		if (newMin > 1) {
			document.getElementById("minuteText").innerHTML = 'minutes';
		}
		else {
			document.getElementById("minuteText").innerHTML = 'minute';
		}
	}
	else if (newMin < 0) {
		newMin = newMin + 60;
		document.getElementById("clockMinutes").innerHTML = newMin;
		document.getElementById("clockHours").innerHTML = currentHours - 1;

		var newHours = document.getElementById("clockHours").innerHTML;
		if (newHours > 1) {
			document.getElementById("hourText").innerHTML = 'hours and';
		}
		else if (newHours == 1) {
			document.getElementById("hourText").innerHTML = 'hour and';
		}
		else {
			document.getElementById("hourText").innerHTML = '';
		}
	}

}, 60*1000);