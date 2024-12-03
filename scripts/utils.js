var intervalId;
const COUNTDOWN_ELEMENT_ID = "countdown-timer";
const RESET_TIMER_BTN_ID = "reset-timer-btn";
const EXISTING_TIMER_CONTAINER_ID = "existing-timer-container";
const ADD_TIMER_BTN_ID = "add-timer-btn";
const ADD_TIMER_CONTAINER_ID = "add-timer-container";
const CSS_HIDDEN_CLASS = "cls-hidden";
const DELETE_TIMER_LINK_ID = "delete-timer-link";
const OPTIONS_PAGE_LINK_ID = "options-page-link";
const HOW_TO_USE_PAGE_LINK_ID = "how-to-use-page-link";
const CS_CTA_BTN_ID = "cs_cta_btn"

function createInPageCTAElement() {
    // Div
    const ctaDiv = document.createElement("div");
    // Button
    const ctaButton = document.createElement("button");
    ctaButton.classList.add('btn', 'btn-pill', 'background-brown', 'text-white', 'text-center');
    ctaButton.innerHTML = "Start Timer"
    //Image
    //const ctaButtonImg = document.createElement("img");
    //ctaButtonImg.setAttribute("src", hourglassImageURL)
    ctaButton.setAttribute("id", CS_CTA_BTN_ID)
    ctaButton.setAttribute("data-has-timer", false)

    //ctaButton.appendChild(ctaButtonImg)
    ctaDiv.appendChild(ctaButton)

    return ctaDiv
}
function changeBuyButtonStyling(buyButtonId, endTime, cssClassesToRemove = [], newCSSClassesToAdd = ['dull-buy-btn']) {
    const buyButtonElem = document.getElementById(buyButtonId);
    if (buyButtonElem != null) {
        // Make the button gray with white text
        if (cssClassesToRemove.length > 0) {
            buyButtonElem.classList.remove(...cssClassesToRemove);
        }
        buyButtonElem.classList.add(newCSSClassesToAdd)
        // Add tooltip on when timer will end
        const titleText = "Timer will end at " + new Date(endTime).toLocaleString()
        buyButtonElem.setAttribute("title", titleText)
    }
}
function revertBuyButtonStyling(buyButtonId, cssClassesToRestore = [], cssClassesToRemove = ['dull-buy-btn']) {
    const buyButtonElem = document.getElementById(buyButtonId);
    if (buyButtonElem != null) {
        // Make the button gray with white text
        if (cssClassesToRemove.length > 0) {
            buyButtonElem.classList.add(...cssClassesToRestore);
        }
        buyButtonElem.classList.remove(cssClassesToRemove)
        // Add tooltip on when timer will end
        const titleText = "Start Timer"
        buyButtonElem.removeAttribute("title")
    }
}

function setClickEventListenerToElement(element, callback) {
    element.addEventListener("click", () => {
        callback()
    })
}



function handleCountDown(url, proposedTime) {
    getOrSetTime(url).then((timeForCountdown) => {
        addSuccessMessage()
        updateDOMwithCountDown(timeForCountdown)
    }).catch((error) => {
        console.error('Failed to add URL to storage or create countdown:', error);
    });
}

function createCountdownTimer(targetDate, elementId, timerPreText = '', showSeconds = true) {
    const timeUnit = showSeconds == true ? 1000 : 1000 * 60;
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

    // Define an update function to be called every second
    const updateTimer = () => {
        // Calculate the remaining time in seconds
        const remainingSeconds = Math.floor(difference / 1000);

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = Math.floor(remainingSeconds % 60);

        const secondsString = showSeconds === true ? `:${seconds.toString().padStart(2, "0")}` : '';

        // Format the remaining time string with leading zeros for hours and minutes
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${secondsString}`;

        // Update the element with the formatted time

        document.getElementById(elementId).innerHTML = timerPreText + formattedTime;

        // Decrement the difference by 1 second
        difference -= timeUnit;

        // Check if the countdown has ended
        if (difference <= 0) {
            clearInterval(intervalId);
            document.getElementById(elementId).innerHTML = "Time's up!";
        }
    };
    // Start the countdown timer with an interval of 1 second
    intervalId = setInterval(updateTimer, timeUnit);
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
function updateDOMwithCountDown(timeForCountdown, showSeconds = true) {
    toggleAddTimerContainerVisibility(false)
    createCountdownTimer(new Date(timeForCountdown), COUNTDOWN_ELEMENT_ID, "Time left: ", showSeconds);
    toggleExistingTimerContainerVisibility(true);
}
function toggleExistingTimerContainerVisibility(isVisible) {
    const existingTimerContainerElem = document.getElementById(EXISTING_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, existingTimerContainerElem)
}
function getCurrentURL() {
    return window.location.href
}
function greyOutBuyButtons(elemIds = [], endTime, cssClassesToRemove = [], newCSSClasses = ['dull-buy-btn']) {
    elemIds.forEach(elemId => {
        changeBuyButtonStyling(elemId, endTime, cssClassesToRemove, newCSSClasses)
    });
}
function unGreyOutBuyButtons(elemIds = [], cssClassesToRemove = ['dull-buy-btn'], cssClassesToRestore = []) {
    elemIds.forEach(elemId => {
        revertBuyButtonStyling(elemId, cssClassesToRestore, cssClassesToRemove,)
    });
}
function startCtaBtnCountdownTimer(storedTime, showSeconds = false) {
    createCountdownTimer(storedTime, CS_CTA_BTN_ID, '', showSeconds)
}
function updatePageDOMIfTimerExists(buyButtonElemIds = [], cssClassesToRemove = []) {
    getStoredTime(getCurrentURL()).then((storedTime) => {
        if (storedTime !== undefined) {
            updatePageDOMWithTimerInterventions(buyButtonElemIds, cssClassesToRemove, storedTime)
        }
    })
}
function updatePageDOMWithTimerInterventions(buyButtonElemIds = [], cssClassesToRemove = [], endTime) {
    greyOutBuyButtons(buyButtonElemIds, endTime, cssClassesToRemove)
    startCtaBtnCountdownTimer(endTime)
}
function removeExistingTimerInterval() {
    clearInterval(intervalId)
}
function removeTimerFromPage(buyButtonElemIds = [], cssClassesToRemove = ['dull-buy-btn'], cssClassesToRestore = []) {
    clearInterval(intervalId)
    unGreyOutBuyButtons(buyButtonElemIds, cssClassesToRemove, cssClassesToRestore)
}
function openOptionsPage(){
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('../pages/options.html'));
    }
}