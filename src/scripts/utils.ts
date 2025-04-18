import { COMPLETED_PURCHASES_STORE_KEY, DEFERRED_PURCHASES_STORE_KEY, GET_PRODUCT_PRICE_ACTION } from "./constants";
import { getStoredTime } from "./utils_chrome_api";

var intervalId: string | number | NodeJS.Timeout | undefined;
var CTAIntervalId: string | number | NodeJS.Timeout | undefined;
// HTML Element variables
const COUNTDOWN_ELEMENT_ID = "countdown-timer";
export const RESET_TIMER_BTNS_CLASS = "reset-timer-btn";
const EXISTING_TIMER_CONTAINER_ID = "existing-timer-container";
export const ADD_TIMER_BTN_ID = "add-timer-btn";
const ADD_TIMER_CONTAINER_ID = "add-timer-container";
const CSS_HIDDEN_CLASS = "cls-hidden";
export const DELETE_TIMER_LINK_ID = "delete-timer-link";
export const OPTIONS_PAGE_LINK_ID = "options-page-link";
export const OPTIONS_PAGE_LINK_CLASS = "options-page-links";
export const HOW_TO_USE_PAGE_LINK_ID = "how-to-use-page-link";
export const HOW_TO_USE_PAGE_LINK_CLASS = "how-to-use-page-links";
export const STATS_PAGE_LINK_ID = "stats-page-link";
export const STATS_PAGE_LINK_CLASS = "stats-page-links";
export const CS_CTA_BTN_ID = "cs_cta_btn"
const COMPLETED_TIMER_CONTAINER_ID = "completed-timer-container";
const HIDDEN_CLASS = "cls-hidden";
export const PURCHASE_FEEDBACK_BTNS_CLASS = "purchase-feedback";
const ASK_FEEDBACK_SECTION_ID = "completed-timer-ask-feedback";
const FEEDBACK_COMPLETED_SECTION_ID = "completed-timer-completed-feedback";
export const STATS_PAGE_NAME = "my-statistics.html";
export const HOW_TO_USE_PAGE_NAME = "how-to-use.html";
export const CTA_BUTTON_TEXT = "Start Timer"
//const VISIBLE_CLASS="cls-visible";

const AMZN_PRICE_INPUT_FIELD_ID = 'attach-base-product-price';

/**
 * Creates a Call-to-Action (CTA) button element within a container div.
 * The button is styled and set to start a timer when clicked.
 *
 * @returns {HTMLDivElement} A div containing the CTA button element.
 */
export function createInPageCTAElement() {
    // Div
    const ctaDiv = document.createElement("div");
    // Button
    const ctaButton = document.createElement("button");
    ctaButton.classList.add('btn', 'btn-pill', 'background-brown', 'text-white', 'text-center');
    //Image
    //const ctaButtonImg = document.createElement("img");
    //ctaButtonImg.setAttribute("src", hourglassImageURL)
    ctaButton.setAttribute("id", CS_CTA_BTN_ID)
    ctaButton.setAttribute("data-has-timer", 'false')
    ctaButton.setAttribute("title", "You can cancel the timer from the extension popup.")

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

function changeBuyButtonStyling(buyButtonId: string, endTime: string | number | Date, cssClassesToRemove: string[] = [], newCSSClassesToAdd = ['dull-buy-btn']) {
    const buyButtonElem = document.getElementById(buyButtonId);
    if (buyButtonElem != null) {
        // Make the button gray with white text
        if (cssClassesToRemove.length > 0) {
            buyButtonElem.classList.remove(...cssClassesToRemove);
        }

        buyButtonElem.classList.add(...newCSSClassesToAdd)
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
function revertBuyButtonStyling(buyButtonId: string, cssClassesToRestore: string[] = [], cssClassesToRemove: string[] = ['dull-buy-btn']) {
    const buyButtonElem = document.getElementById(buyButtonId);
    if (buyButtonElem != null) {
        // Make the button gray with white text
        if (cssClassesToRemove.length > 0) {
            buyButtonElem.classList.add(...cssClassesToRestore);
        }
        buyButtonElem.classList.remove(...cssClassesToRemove)
        // Add tooltip on when timer will end
        const titleText = "Start Timer"
        buyButtonElem.removeAttribute("title")
    }
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
function createCountdownTimer(targetDate: string | Date | number, elementId: string, timerPreText = '', showSeconds = true) {
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

        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = timerPreText + formattedTime;
        }

        // Decrement the difference by 1 second
        difference -= timeUnit;

        // Check if the countdown has ended
        if (difference <= 0) {
            clearInterval(CTAIntervalId);
            toggleExistingTimerContainerVisibility(false);
            toggleCompletedTimerContainerVisibility(true);
            //document.getElementById(elementId).innerHTML = "Time's up!";
        }
    };
    // Start the countdown timer with an interval of 1 second
    CTAIntervalId = setInterval(updateTimer, timeUnit);
    return true;
}

/**
 * Retrieves the URL of the current active tab.
 *
 * @param {Array} tabs - An array of tab objects.
 * @returns {string|undefined} The URL of the current tab, or undefined if not found.
 */
export function getCurrentTabUrl(tabs: Array<any>) {
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
    if (existingTimerContainerElem) {
        existingTimerContainerElem.insertBefore(successTextElem, existingTimerContainerElem.firstChild);
    }
}
/**
 * Toggles the visibility of a given HTML element by adding or removing a CSS class.
 *
 * @param {boolean} isVisible - Whether the element should be visible.
 * @param {HTMLElement|null} elem - The element to toggle visibility for.
 */
function toggleElementVisibility(isVisible: boolean, elem: HTMLElement | null) {
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
export function toggleAddTimerContainerVisibility(isVisible: boolean) {
    const addTimerContainerElem = document.getElementById(ADD_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, addTimerContainerElem)
}
/**
 * Checks if a timer already exists for the current tab's URL and updates the DOM accordingly.
 */
export function checkForExistingTimer() {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.storage.local.get(url, (result) => {
            var storedTime = result[url]
            if (storedTime == undefined) {
                toggleAddTimerContainerVisibility(true)
            } else {
                updateDOMwithCountDown(storedTime['time'])
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
export function updateDOMwithCountDown(timeForCountdown: number | string | Date, showSeconds = true) {
    toggleAddTimerContainerVisibility(false)
    var started_timer = createCountdownTimer(new Date(timeForCountdown), COUNTDOWN_ELEMENT_ID, "Time left: ", showSeconds);
    if (started_timer === true) {
        toggleExistingTimerContainerVisibility(true);
        toggleCompletedTimerContainerVisibility(false)

    } else {
        toggleExistingTimerContainerVisibility(false);
        toggleCompletedTimerContainerVisibility(true);
        // Hide feedback buttons if feedback has already been provided
        checkIfFeedbackIsProvided().then((wasFeedbackProvided) => {
            if (wasFeedbackProvided == true) { handlePostFeedbackSubmission() }
        })


    }
}
/**
 * Toggles the visibility of the "Existing Timer" container.
 *
 * @param {boolean} isVisible - Whether the container should be visible.
 */

export function toggleExistingTimerContainerVisibility(isVisible: boolean) {
    const existingTimerContainerElem = document.getElementById(EXISTING_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, existingTimerContainerElem)
}
/**
 * Toggles the visibility of the "Completed Timer" container.
 *
 * @param {boolean} isVisible - Whether the container should be visible.
 */

function toggleCompletedTimerContainerVisibility(isVisible: boolean) {
    const completedTimerContainerElem = document.getElementById(COMPLETED_TIMER_CONTAINER_ID)
    toggleElementVisibility(isVisible, completedTimerContainerElem)
}
/**
 * Retrieves the current page's URL.
 *
 * @returns {string} The current page URL.
 */

export function getCurrentURL() {
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

export function greyOutBuyButtons(elemIds: string[] = [], endTime: string | number | Date, cssClassesToRemove: string[] = [], newCSSClasses: string[] = ['dull-buy-btn']) {
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

function unGreyOutBuyButtons(elemIds: string[] = [], cssClassesToRemove: string[] = ['dull-buy-btn'], cssClassesToRestore: string[] = []) {
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
function startCtaBtnCountdownTimer(storedTime: number | string | Date, showSeconds = false) {
    createCountdownTimer(storedTime, CS_CTA_BTN_ID, '', showSeconds)
}
/**
 * Updates the page DOM if a timer exists in storage for the current URL.
 *
 * @param {Array<string>} buyButtonElemIds - An array of button element IDs.
 * @param {Array<string>} cssClassesToRemove - CSS classes to remove from the buttons.
 */

export function updatePageDOMIfTimerExists(buyButtonElemIds: string[] = [], cssClassesToRemove: string[] = []) {
    getStoredTime(getCurrentURL()).then((storedTime) => {
        storedTime = storedTime as string | undefined;
        if (storedTime !== undefined && storedTime !== null && typeof (storedTime) == "string" && new Date(storedTime).getTime() > Date.now()) {
            updatePageDOMWithTimerInterventions(buyButtonElemIds, cssClassesToRemove, String(storedTime))
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

export function updatePageDOMWithTimerInterventions(buyButtonElemIds: string[] = [], cssClassesToRemove: string[] = [], endTime: string | number | Date) {
    greyOutBuyButtons(buyButtonElemIds, endTime, cssClassesToRemove)
    startCtaBtnCountdownTimer(endTime, true)
}
/**
 * Clears the existing countdown timer interval.
 */
export function removeExistingTimerInterval() {
    clearInterval(intervalId)
}
/**
 * Removes the timer from the page and resets button styling.
 *
 * @param {Array<string>} buyButtonElemIds - An array of button element IDs.
 * @param {Array<string>} cssClassesToRemove - CSS classes to remove from the buttons.
 * @param {Array<string>} cssClassesToRestore - CSS classes to restore on the buttons.
 */
export function removeTimerFromPage(buyButtonElemIds: string[] = [], cssClassesToRemove: string[] = ['dull-buy-btn'], cssClassesToRestore: string[] = []) {
    clearInterval(CTAIntervalId);
    unGreyOutBuyButtons(buyButtonElemIds, cssClassesToRemove, cssClassesToRestore);
    addStartTimerTextToCTAButton();
}
/**
 * Opens the extension's options page.
 */
export function openOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        openPage("options.html");
    }
}
export function getExtensionPageURL(pageRelativePath: string){
    return chrome.runtime.getURL('../pages/' + pageRelativePath)
}
export function getExtensionPageURL2(pageRelativePath: string){
    return chrome.runtime.getURL('pages/' + pageRelativePath)
}
/**
 * Open one of the pages in the 'pages' directory. 
 * @param {string} pageRelativePath -Relative page path with file extension. 
 */
export function openPage(pageRelativePath: string) {
    window.open(getExtensionPageURL(pageRelativePath));
}
/**
 * Handles the submission of post-feedback, toggling visibility of relevant sections.
 */
export function handlePostFeedbackSubmission() {
    toggleElementVisibility(false,
        document.getElementById(ASK_FEEDBACK_SECTION_ID));
    toggleElementVisibility(true,
        document.getElementById(FEEDBACK_COMPLETED_SECTION_ID));
}
/**
 * Retrieves the stored deferred and non-deferred (completed) purchases from Chrome's local storage.
 *
 * @returns {Promise<{ deferred: string[], completed: string[] }>} A promise resolving to an object containing deferred and completed purchases.
 */
export function getStoredPurchases() {
    return chrome.storage.local.get([DEFERRED_PURCHASES_STORE_KEY, COMPLETED_PURCHASES_STORE_KEY]).then((result) => {
        const deferred = result[DEFERRED_PURCHASES_STORE_KEY] ? JSON.parse(result[DEFERRED_PURCHASES_STORE_KEY]) : [];
        const completed = result[COMPLETED_PURCHASES_STORE_KEY] ? JSON.parse(result[COMPLETED_PURCHASES_STORE_KEY]) : [];
        return { deferred, completed };
    });
}
/**
 * 
 * @param {string} url Url of current page
 * @returns {Promise<boolean>} Boolean representing if feedback was provided for 
 *      the current timer. True means feedback was provided
 */
function checkIfFeedbackIsProvided() {
    return chrome.tabs.query(
        { active: true, currentWindow: true }).then((tabs) => {
            return getCurrentTabUrl(tabs);
        }).then((url) => {
            return Promise.all([getStoredTime(url), getStoredPurchases()])
                .then((values) => {
                    const storedTime: string = values[0] as string;
                    const storedFeedback = values[1].deferred.concat(values[1].completed);

                    // Find feedback entry that matches the given URL
                    //TODO: Remove old logic
                    const feedbackEntry = storedFeedback.find((entry: { url: any; timerEndTime: string | number | Date; }) => ((entry?.url === url) || entry == url) && (!entry?.timerEndTime || new Date(storedTime).getTime() == new Date(entry.timerEndTime).getTime()));

                    if (!feedbackEntry) {
                        return false;
                    } else {
                        return true
                    }
                })
                .catch((error) => {
                    console.error("An error occurred while checking feedback:", error);
                    return false;
                });
        })
}

/**
 * Changes 'add timer' button styling and text to match disabled status. 
 */
export function handleTimerDisabled() {
    const addTimerBtn = document.getElementById(ADD_TIMER_BTN_ID);
    if (addTimerBtn) {
        addTimerBtn.classList.add('dull-buy-btn');
        (addTimerBtn as HTMLButtonElement).disabled = true
        addTimerBtn.title = "Timer is disabled. Visit the options page to enable it."
        //TODO: Add message below button informing user the intervention is disabled
    }
}
/**
 * Change UI when timer is enabled.
 * Change 'add-timer' text to match user reflection period. 
 * @param {int} timerDuration Time in hours of the timer countdown
 */
export function handleTimerEnabled(timerDuration: any) {
    const timerButtonText = `Yes! Add ${timerDuration} Hour countdown`
    const addTimerBtn = document.getElementById(ADD_TIMER_BTN_ID);
    if (addTimerBtn) {
        addTimerBtn.innerText = timerButtonText;
        addTimerBtn.classList.add('background-brown')
    }
}
/**
 * Checks if any active interventions (timers) exist in storage.
 * If a timer exists, it updates the "Add Timer" button's styling to indicate its disabled state.
 */
export function checkActiveInterventions() {
    chrome.storage.local.get({ timer: true, timerDuration: 24 }).then(
        (items) => {
            if (items.timer === false) {
                //TODO: Add message informing user the intervention is disabled
                handleTimerDisabled()
            } else {
                handleTimerEnabled(items.timerDuration)
            }
        }
    );
}
export function getProductPriceFromPage() {
    return chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        var activeTab = tabs[0];
        if (activeTab.id !== undefined) {
            return chrome.tabs.sendMessage(activeTab.id, { action: GET_PRODUCT_PRICE_ACTION }).then((price) => price, () => 0);
        } else {
            return Promise.resolve(0);
        }
    });
}
/**
 * Get the url of the tab that is currently open in the browser. 
 * @returns {Promise<string>}
 */
export function getCurrentUrlFromActiveTab() {
    return chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        return getCurrentTabUrl(tabs);
    })
}

/**
 * Sends a message to set/reset a timer using a Chrome extension's 
 * runtime messaging API to the background process.
 *
 * @param {string} action - The action to perform, defaulting to 'set-timer'. Possible actions can be customized.
 * @param {string} url - The URL associated with the action.
 * @param {number} price - The price or value associated with the action.
 * @returns {Promise<any>} - A promise that resolves with the response from the background script.
 */
export function setTimeUsingBackgroundProcess(action = 'set-timer', url: any, price: any) {
    return chrome.runtime.sendMessage({ action: action, url: url, initiator: 'popup', price: price });
}

export function extractProductPriceFromAmazonPage() {
    const priceInputElement = document.getElementById(AMZN_PRICE_INPUT_FIELD_ID)
    return priceInputElement ? (priceInputElement as HTMLInputElement).value : 0;
}
export function addStartTimerTextToCTAButton() {
    const ctaBtn = document.getElementById(CS_CTA_BTN_ID);
    if (ctaBtn !== null) {
        ctaBtn.innerText = CTA_BUTTON_TEXT;
        ctaBtn.setAttribute("data-has-timer", 'false');
    }
}
export type StoredInfo = {
    url: string;
    time: string;
    price: string;
}

