
const twentyFourHours = 24 * 60 * 60000;
var intervalId;
const COUNTDOWN_ELEMENT_ID = "countdown-timer";
const RESET_TIMER_BTN_ID = "reset-timer-btn";
const EXISTING_TIMER_CONTAINER_ID = "existing-timer-container";
const ADD_TIMER_BTN_ID = "add-timer-btn";
const ADD_TIMER_CONTAINER_ID = "add-timer-container";
const CSS_HIDDEN_CLASS = "cls-hidden";
const DELETE_TIMER_LINK_ID = "delete-timer-link";

function handleCountDown(url, proposedTime) {
    chrome.storage.local.get(url).then((result) => {
        var storedTime = result[url]
        if (storedTime == undefined) {
            var urlTime = {};
            urlTime[url] = new Date(proposedTime).toString()
            return chrome.storage.local.set(urlTime).then(
                () => {
                    return proposedTime
                });
        };
        return storedTime
    }).then((timeForCountdown) => {
        addSuccessMessage()
        updateDOMwithCountDown(timeForCountdown)
    }).catch((error) => {
        console.error('Failed to add URL to storage or create countdown:', error);
    });
}

function createCountdownTimer(targetDate, elementId) {
    // Get the target date and time in milliseconds
    const targetTime = new Date(targetDate).getTime();

    // Get the current time in milliseconds
    const now = Date.now();

    // Calculate the difference in milliseconds
    var difference = targetTime - now;

    // Check if the countdown has already ended
    if (difference <= 0) {
        document.getElementById(elementId).innerHTML = "Time's up!";
        return;
    }

    const timerPreText = "Time left: "
    // Define an update function to be called every second
    const updateTimer = () => {
        // Calculate the remaining time in seconds
        const remainingSeconds = Math.floor(difference / 1000);

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = Math.floor(remainingSeconds % 60);

        // Format the remaining time string with leading zeros for hours and minutes
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        // Update the element with the formatted time

        document.getElementById(elementId).innerHTML = timerPreText + formattedTime;

        // Decrement the difference by 1 second
        difference -= 1000;

        // Check if the countdown has ended
        if (difference <= 0) {
            clearInterval(intervalId);
            document.getElementById(elementId).innerHTML = "Time's up!";
        }
    };

    // Start the countdown timer with an interval of 1 second
    intervalId = setInterval(updateTimer, 1000);
}

function getCurrentTabUrl(tabs) {
    if (tabs && tabs.length > 0) {
        const url = tabs[0].url;
        return url
    } else {
        console.error("Failed to get the current tab's URL.");
    }
}
function addSuccessMessage() {
    var successTextElem = document.createElement("p");
    var successText = document.createTextNode("Added to timer!");
    successTextElem.appendChild(successText);
    const existingTimerContainerElem = document.getElementById(EXISTING_TIMER_CONTAINER_ID)
    existingTimerContainerElem.insertBefore(successTextElem, existingTimerContainerElem.firstChild)
}
function toggleElementVisibility(isVisible, elem) {
    if (elem !== null) {
        if (isVisible === true) {
            elem.classList.remove(CSS_HIDDEN_CLASS)
        } else {
            elem.classList.add(CSS_HIDDEN_CLASS)
        }
    }
}
function toggleAddTimerContainerVisibility(isVisible) {
    const addTimerContainerElem = document.getElementById(ADD_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, addTimerContainerElem)
}
function toggleExistingTimerContainerVisibility(isVisible) {
    const existingTimerContainerElem = document.getElementById(EXISTING_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, existingTimerContainerElem)
}
function updateDOMwithCountDown(timeForCountdown) {
    toggleAddTimerContainerVisibility(false)
    createCountdownTimer(new Date(timeForCountdown), COUNTDOWN_ELEMENT_ID);
    toggleExistingTimerContainerVisibility(true);
}

function checkForExistingTimer() {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.storage.local.get(url).then((result) => {
            var storedTime = result[url]
            if (storedTime == undefined) {
                toggleAddTimerContainerVisibility(true)
            } else {
                updateDOMwithCountDown(storedTime)
            }
        })
    })
}
checkForExistingTimer();

document.getElementById(ADD_TIMER_BTN_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        let currentTime = new Date(Date.now() + twentyFourHours);
        handleCountDown(url, currentTime)

    });
})

document.getElementById(RESET_TIMER_BTN_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.storage.local.remove(url).then(() => {
            let currentTime = new Date(Date.now() + twentyFourHours);
            clearInterval(intervalId);
            handleCountDown(url, currentTime);
        })
    });
})
document.getElementById(DELETE_TIMER_LINK_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        var url = getCurrentTabUrl(tabs);
        chrome.storage.local.remove(url).then(() => {
            clearInterval(intervalId);
            toggleAddTimerContainerVisibility(true);
            toggleExistingTimerContainerVisibility(false);
        })
    })
})