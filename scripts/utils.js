var intervalId;
// HTML Element variables
const COUNTDOWN_ELEMENT_ID = "countdown-timer";
const RESET_TIMER_BTNS_CLASS = "reset-timer-btn";
const EXISTING_TIMER_CONTAINER_ID = "existing-timer-container";
const ADD_TIMER_BTN_ID = "add-timer-btn";
const ADD_TIMER_CONTAINER_ID = "add-timer-container";
const CSS_HIDDEN_CLASS = "cls-hidden";
const DELETE_TIMER_LINK_ID = "delete-timer-link";
const OPTIONS_PAGE_LINK_ID = "options-page-link";
const HOW_TO_USE_PAGE_LINK_ID = "how-to-use-page-link";
const STATS_PAGE_LINK_ID = "stats-page-link";
const CS_CTA_BTN_ID = "cs_cta_btn"
const COMPLETED_TIMER_CONTAINER_ID = "completed-timer-container";
const HIDDEN_CLASS = "cls-hidden";
const PURCHASE_FEEDBACK_BTNS_CLASS = "purchase-feedback";
const ASK_FEEDBACK_SECTION_ID = "completed-timer-ask-feedback";
const FEEDBACK_COMPLETED_SECTION_ID = "completed-timer-completed-feedback";
const STATS_PAGE_NAME="my-statistics.html";
const HOW_TO_USE_PAGE_NAME="how-to-use.html";
//const VISIBLE_CLASS="cls-visible";

/**
 * Creates a Call-to-Action (CTA) button element within a container div.
 * The button is styled and set to start a timer when clicked.
 *
 * @returns {HTMLDivElement} A div containing the CTA button element.
 */
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
/**
 * Changes the styling of a "buy" button and sets a tooltip showing when the timer will end.
 *
 * @param {string} buyButtonId - The ID of the buy button element.
 * @param {number} endTime - The timestamp indicating when the timer ends.
 * @param {Array<string>} cssClassesToRemove - An array of CSS classes to remove from the button.
 * @param {Array<string>} newCSSClassesToAdd - An array of CSS classes to add to the button.
 */

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
/**
 * Reverts the styling of a "buy" button to its original state.
 *
 * @param {string} buyButtonId - The ID of the buy button element.
 * @param {Array<string>} cssClassesToRestore - An array of CSS classes to restore on the button.
 * @param {Array<string>} cssClassesToRemove - An array of CSS classes to remove from the button.
 */
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

/**
 * Sets a click event listener on an element and executes a callback when clicked.
 *
 * @param {HTMLElement} element - The HTML element to attach the click event to.
 * @param {Function} callback - The function to execute when the element is clicked.
 */

function setClickEventListenerToElement(element, callback) {
    element.addEventListener("click", () => {
        callback()
    })
}


/**
 * Handles countdown logic by retrieving or setting the timer and updating the DOM accordingly.
 *
 * @param {string} url - The URL used to identify the timer in storage.
 * @param {number} proposedTime - The proposed time for the countdown.
 */
function handleCountDown(url, proposedTime) {
    getOrSetTime(url).then((timeForCountdown) => {
        addSuccessMessage()
        updateDOMwithCountDown(timeForCountdown)
    }).catch((error) => {
        console.error('Failed to add URL to storage or create countdown:', error);
    });
}
/**
 * Creates a countdown timer that updates a specified element in the DOM.
 *
 * @param {string|Date} targetDate - The target date and time for the countdown.
 * @param {string} elementId - The ID of the HTML element to update with the timer.
 * @param {string} timerPreText - Text to display before the countdown timer.
 * @param {boolean} showSeconds - Whether to show seconds in the countdown timer.
 * @returns {boolean} Returns true if the timer was successfully created, otherwise false.
 */
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
        //document.getElementById(elementId).innerHTML = "Time's up!";
        return false;
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
            toggleExistingTimerContainerVisibility(false);
            toggleCompletedTimerContainerVisibility(true);
            //document.getElementById(elementId).innerHTML = "Time's up!";
        }
    };
    // Start the countdown timer with an interval of 1 second
    intervalId = setInterval(updateTimer, timeUnit);
    return true;
}

/**
 * Retrieves the URL of the current active tab.
 *
 * @param {Array} tabs - An array of tab objects.
 * @returns {string|undefined} The URL of the current tab, or undefined if not found.
 */
function getCurrentTabUrl(tabs) {
    if (tabs && tabs.length > 0) {
        const url = tabs[0].url;
        return url
    } else {
        console.error("Failed to get the current tab's URL.");
    }
}

/**
 * Adds a success message indicating that the timer has been added.
 */
function addSuccessMessage() {
    var successTextElem = document.createElement("p");
    var successText = document.createTextNode("Added to timer!");
    successTextElem.appendChild(successText);
    const existingTimerContainerElem = document.getElementById(EXISTING_TIMER_CONTAINER_ID)
    existingTimerContainerElem.insertBefore(successTextElem, existingTimerContainerElem.firstChild)
}
/**
 * Toggles the visibility of a given HTML element by adding or removing a CSS class.
 *
 * @param {boolean} isVisible - Whether the element should be visible.
 * @param {HTMLElement|null} elem - The element to toggle visibility for.
 */
function toggleElementVisibility(isVisible, elem) {
    if (elem !== null) {
        if (isVisible === true) {
            elem.classList.remove(CSS_HIDDEN_CLASS)
        } else {
            elem.classList.add(CSS_HIDDEN_CLASS)
        }
    }
}
/**
 * Toggles the visibility of the "Add Timer" container.
 *
 * @param {boolean} isVisible - Whether the container should be visible.
 */
function toggleAddTimerContainerVisibility(isVisible) {
    const addTimerContainerElem = document.getElementById(ADD_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, addTimerContainerElem)
}
/**
 * Checks if a timer already exists for the current tab's URL and updates the DOM accordingly.
 */
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
/**
 * Updates the DOM to display a countdown timer based on the provided time.
 *
 * @param {number|string|Date} timeForCountdown - The time to count down to.
 * @param {boolean} showSeconds - Whether to show seconds in the countdown.
 */
function updateDOMwithCountDown(timeForCountdown, showSeconds = true) {
    toggleAddTimerContainerVisibility(false)
    var started_timer = createCountdownTimer(new Date(timeForCountdown), COUNTDOWN_ELEMENT_ID, "Time left: ", showSeconds);
    if (started_timer === true) {
        toggleExistingTimerContainerVisibility(true);
        toggleCompletedTimerContainerVisibility(false)

    } else {
        toggleCompletedTimerContainerVisibility(true)
        toggleExistingTimerContainerVisibility(false);

    }
}
/**
 * Toggles the visibility of the "Existing Timer" container.
 *
 * @param {boolean} isVisible - Whether the container should be visible.
 */

function toggleExistingTimerContainerVisibility(isVisible) {
    const existingTimerContainerElem = document.getElementById(EXISTING_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, existingTimerContainerElem)
}
/**
 * Toggles the visibility of the "Completed Timer" container.
 *
 * @param {boolean} isVisible - Whether the container should be visible.
 */

function toggleCompletedTimerContainerVisibility(isVisible) {
    const completedTimerContainerElem = document.getElementById(COMPLETED_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, completedTimerContainerElem)
}
/**
 * Retrieves the current page's URL.
 *
 * @returns {string} The current page URL.
 */

function getCurrentURL() {
    return window.location.href
}
/**
 * Greys out multiple "buy" buttons and sets tooltips with the timer end time.
 *
 * @param {Array<string>} elemIds - An array of button element IDs.
 * @param {number} endTime - The timestamp when the timer ends.
 * @param {Array<string>} cssClassesToRemove - CSS classes to remove.
 * @param {Array<string>} newCSSClasses - CSS classes to add.
 */

function greyOutBuyButtons(elemIds = [], endTime, cssClassesToRemove = [], newCSSClasses = ['dull-buy-btn']) {
    elemIds.forEach(elemId => {
        changeBuyButtonStyling(elemId, endTime, cssClassesToRemove, newCSSClasses)
    });
}
/**
 * Restores the original state of multiple "buy" buttons.
 *
 * @param {Array<string>} elemIds - An array of button element IDs.
 * @param {Array<string>} cssClassesToRemove - CSS classes to remove.
 * @param {Array<string>} cssClassesToRestore - CSS classes to restore.
 */

function unGreyOutBuyButtons(elemIds = [], cssClassesToRemove = ['dull-buy-btn'], cssClassesToRestore = []) {
    elemIds.forEach(elemId => {
        revertBuyButtonStyling(elemId, cssClassesToRestore, cssClassesToRemove,)
    });
}
/**
 * Starts a countdown timer for the CTA button.
 *
 * @param {number|string|Date} storedTime - The target time for the countdown.
 * @param {boolean} showSeconds - Whether to show seconds in the countdown.
 */
function startCtaBtnCountdownTimer(storedTime, showSeconds = false) {
    createCountdownTimer(storedTime, CS_CTA_BTN_ID, '', showSeconds)
}
/**
 * Updates the page DOM if a timer exists in storage for the current URL.
 *
 * @param {Array<string>} buyButtonElemIds - An array of button element IDs.
 * @param {Array<string>} cssClassesToRemove - CSS classes to remove from the buttons.
 */

function updatePageDOMIfTimerExists(buyButtonElemIds = [], cssClassesToRemove = []) {
    getStoredTime(getCurrentURL()).then((storedTime) => {
        if (storedTime !== undefined) {
            updatePageDOMWithTimerInterventions(buyButtonElemIds, cssClassesToRemove, storedTime)
        }
    })
}
/**
 * Updates the page by greying out buttons and starting a countdown timer for the CTA button.
 *
 * @param {Array<string>} buyButtonElemIds - An array of button element IDs.
 * @param {Array<string>} cssClassesToRemove - CSS classes to remove from the buttons.
 * @param {number} endTime - The timestamp when the timer ends.
 */

function updatePageDOMWithTimerInterventions(buyButtonElemIds = [], cssClassesToRemove = [], endTime) {
    greyOutBuyButtons(buyButtonElemIds, endTime, cssClassesToRemove)
    startCtaBtnCountdownTimer(endTime)
}
/**
 * Clears the existing countdown timer interval.
 */
function removeExistingTimerInterval() {
    clearInterval(intervalId)
}
/**
 * Removes the timer from the page and resets button styling.
 *
 * @param {Array<string>} buyButtonElemIds - An array of button element IDs.
 * @param {Array<string>} cssClassesToRemove - CSS classes to remove from the buttons.
 * @param {Array<string>} cssClassesToRestore - CSS classes to restore on the buttons.
 */
function removeTimerFromPage(buyButtonElemIds = [], cssClassesToRemove = ['dull-buy-btn'], cssClassesToRestore = []) {
    clearInterval(intervalId)
    unGreyOutBuyButtons(buyButtonElemIds, cssClassesToRemove, cssClassesToRestore)
}
/**
 * Opens the extension's options page.
 */
function openOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        openPage("options.html");
    }
}
/**
 * Open one of the pages in the 'pages' directory. 
 * @param {string} pageRelativePath -Relative page path with file extension. 
 */
function openPage(pageRelativePath) {
    window.open(chrome.runtime.getURL('../pages/' + pageRelativePath));
}
/**
 * Handles the submission of post-feedback, toggling visibility of relevant sections.
 */
function handlePostFeedbackSubmission() {
    toggleElementVisibility(false,
        document.getElementById(ASK_FEEDBACK_SECTION_ID));
    toggleElementVisibility(true,
        document.getElementById(FEEDBACK_COMPLETED_SECTION_ID));
}