import { getStoredTime, getOrSetTime, } from "./utils_chrome_api.js";
export const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 24 * 60 * 60000;

var intervalId: number | undefined;
const COUNTDOWN_ELEMENT_ID = "countdown-timer";
export const RESET_TIMER_BTN_ID = "reset-timer-btn";
const EXISTING_TIMER_CONTAINER_ID = "existing-timer-container";
export const ADD_TIMER_BTN_ID = "add-timer-btn";
const ADD_TIMER_CONTAINER_ID = "add-timer-container";
const CSS_HIDDEN_CLASS = "cls-hidden";
export const DELETE_TIMER_LINK_ID = "delete-timer-link";
const CS_CTA_BTN_ID = "cs_cta_btn"

export function createInPageCTAElement() {
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
    ctaButton.setAttribute("data-has-timer", 'false')

    //ctaButton.appendChild(ctaButtonImg)
    ctaDiv.appendChild(ctaButton)

    return ctaDiv
}
function changeBuyButtonStyling(buyButtonId: string, endTime: string | number | Date, cssClassesToRemove = []) {
    const buyButtonElem = document.getElementById(buyButtonId);
    if (buyButtonElem != null) {
        // Make the button gray with white text
        if (cssClassesToRemove.length > 0) {
            buyButtonElem.classList.remove(...cssClassesToRemove);
        }
        buyButtonElem.classList.add('dull-buy-btn')
        // Add tooltip on when timer will end
        const titleText = "Timer will end at " + new Date(endTime).toLocaleString()
        buyButtonElem.setAttribute("title", titleText)
    }
}

export function setClickEventListenerToElement(element: { addEventListener: (arg0: string, arg1: () => void) => void; }, callback: () => void) {
    element.addEventListener("click", () => {
        callback()
    })
}



export function handleCountDown(url: any, proposedTime: any) {
    getOrSetTime(url).then((timeForCountdown: any) => {
        addSuccessMessage()
        updateDOMwithCountDown(timeForCountdown)
    }).catch((error: any) => {
        console.error('Failed to add URL to storage or create countdown:', error);
    });
}

function createCountdownTimer(targetDate: string | number | Date, elementId: string, timerPreText = '', showSeconds = true) {
    // Get the target date and time in milliseconds
    const targetTime = new Date(targetDate).getTime();

    // Get the current time in milliseconds
    const now = Date.now();

    // Calculate the difference in milliseconds
    var difference = targetTime - now;

    // Check if the countdown has already ended
    if (difference <= 0) {
        const timeElement = document.getElementById(elementId);
        if (timeElement !== null) {
            timeElement.innerHTML = "Time's up!";
        }

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

        const timeElement = document.getElementById(elementId);
        if (timeElement !== null) {
            timeElement.innerHTML = timerPreText + formattedTime;
        }

        // Decrement the difference by 1 second
        difference -= 1000;

        // Check if the countdown has ended
        if (difference <= 0) {
            clearInterval(intervalId);
            if (timeElement !== null) {
                timeElement.innerHTML = "Time's up!";
            }
        }
    };

    // Start the countdown timer with an interval of 1 second
    intervalId = setInterval(updateTimer, 1000);
}

export function getCurrentTabUrl(tabs: string | any[]) {
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
    existingTimerContainerElem?.insertBefore(successTextElem, existingTimerContainerElem.firstChild)
}
export function toggleElementVisibility(isVisible: boolean, elem: HTMLElement | null) {
    if (elem !== null) {
        if (isVisible === true) {
            elem.classList.remove(CSS_HIDDEN_CLASS)
        } else {
            elem.classList.add(CSS_HIDDEN_CLASS)
        }
    }
}
export function toggleAddTimerContainerVisibility(isVisible: boolean) {
    const addTimerContainerElem = document.getElementById(ADD_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, addTimerContainerElem)
}
export function checkForExistingTimer() {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.storage.local.get(url, (result) => {
            var storedTime = result[url]
            if (storedTime == undefined) {
                toggleAddTimerContainerVisibility(true)
            } else {
                updateDOMwithCountDown(storedTime)
            }
        })
    })
}
export function updateDOMwithCountDown(timeForCountdown: string | number | Date) {
    toggleAddTimerContainerVisibility(false)
    createCountdownTimer(new Date(timeForCountdown), COUNTDOWN_ELEMENT_ID, "Time left: ", true);
    toggleExistingTimerContainerVisibility(true);
}
export function toggleExistingTimerContainerVisibility(isVisible: boolean) {
    const existingTimerContainerElem = document.getElementById(EXISTING_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, existingTimerContainerElem)
}
export function getCurrentURL() {
    return window.location.href
}
export function greyOutBuyButtons(elemIds: any[] | undefined , endTime: string | number | Date, cssClassesToRemove = []) {
    elemIds?.forEach((elemId: string) => {
        changeBuyButtonStyling(elemId, endTime, cssClassesToRemove)
    });
}
function startCtaBtnCountdownTimer(storedTime: string | number | Date) {
    createCountdownTimer(storedTime, CS_CTA_BTN_ID, '', true)

}
export function updatePageDOMIfTimerExists(buyButtonElemIds: string[] | undefined, cssClassesToRemove = []) {
    getStoredTime(getCurrentURL()).then((storedTime: undefined) => {
        if (storedTime !== undefined) {
            greyOutBuyButtons(buyButtonElemIds, storedTime, cssClassesToRemove)
            startCtaBtnCountdownTimer(storedTime)
        }
    })
}