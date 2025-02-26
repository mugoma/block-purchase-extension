import { checkForExistingTimer, getCurrentTabUrl, openOptionsPage, openPage, removeExistingTimerInterval, toggleAddTimerContainerVisibility, toggleExistingTimerContainerVisibility, updateDOMwithCountDown, handlePostFeedbackSubmission, RESET_TIMER_BTNS_CLASS, DELETE_TIMER_LINK_ID, PURCHASE_FEEDBACK_BTNS_CLASS, STATS_PAGE_LINK_CLASS, ADD_TIMER_BTN_ID, STATS_PAGE_NAME, checkActiveInterventions, getProductPriceFromPage, setTimeUsingBackgroundProcess, OPTIONS_PAGE_LINK_ID, getCurrentUrlFromActiveTab } from '../utils';
import { getUrlData } from '../utils_chrome_api';
// Call to check if a timer already exists for the current tab when the script loads
checkForExistingTimer();

/**
 * Adds a click event listener to the "Add Timer" button.
 * When clicked, it sets a timer for the current tab's URL and updates the DOM with the countdown timer.
 */
const addTimerBtn = document.getElementById(ADD_TIMER_BTN_ID);
if (addTimerBtn) {
    addTimerBtn.addEventListener("click", () => {
        // Get the current page's url and product price concurrently
        Promise.all([getCurrentUrlFromActiveTab(), getProductPriceFromPage()]).then((results) => {
            const [url, price] = results
            // Send a message to set a timer and update the DOM with the countdown
            setTimeUsingBackgroundProcess('set-timer', url, price).then((endTime) => {
                updateDOMwithCountDown(endTime)
            })
        });
    });
}

/**
 * Adds click event listeners to all elements with the "Reset Timer" button class.
 * When clicked, it resets the timer for the current tab's URL, removes the existing timer interval,
 * and updates the DOM with the new countdown timer.
 */
Array.from(document.getElementsByClassName(RESET_TIMER_BTNS_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        // Remove page countdown
        removeExistingTimerInterval();
        // Get the current page's url and product price concurrently
        Promise.all([getCurrentUrlFromActiveTab(), getProductPriceFromPage()]).then((results) => {
            const [url, price] = results
            // Send a message to reset the timer and update the DOM with the new countdown
            setTimeUsingBackgroundProcess('reset-timer', url, price).then((endTime) => {
                updateDOMwithCountDown(endTime)
            })
        })
    })
})
/**
 * Adds a click event listener to the "Delete Timer" link.
 * When clicked, it deletes the timer for the current tab's URL, removes the timer interval,
 * and updates the visibility of the timer containers in the DOM.
 */
const deleteTimerLink = document.getElementById(DELETE_TIMER_LINK_ID);
if (deleteTimerLink) {
    deleteTimerLink.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            var url = getCurrentTabUrl(tabs);
            // Send a message to delete the timer and update the DOM accordingly
            chrome.runtime.sendMessage({ action: 'delete-timer', url: url, initiator: 'popup' }).then(() => {
                removeExistingTimerInterval()
                toggleAddTimerContainerVisibility(true);
                toggleExistingTimerContainerVisibility(false);
            })
        })
    });
}

/**
 * Adds click event listeners to all elements with the "Purchase Feedback" button class.
 * When clicked, it records whether a purchase was deferred or completed,
 * and updates the feedback sections in the DOM accordingly.
 */
Array.from(document.getElementsByClassName(PURCHASE_FEEDBACK_BTNS_CLASS)).forEach(element => {
    element.addEventListener("click", (event) => {
        getCurrentUrlFromActiveTab().then((url) => {
            // Determine if the purchase was deferred based on the button's dataset
            getUrlData(url).then((urlData) => {
                const [timerEndTime, price] = [(urlData as { time: number, price: number })['time'], (urlData as { time: number, price: number })['price']]
                const target = event.target as HTMLElement;
                const wasDeferred = target && target.dataset.proceededWithPurchase === "y" ? false : true;
                chrome.runtime.sendMessage(
                    {
                        action: 'add-purchase-stat', url: url, initiator: 'popup',
                        wasDeferred: wasDeferred, timerEndTime: timerEndTime, price: price
                    }).then(() => {
                        // Handle the UI updates after feedback submission
                        handlePostFeedbackSubmission()
                    })
            })
        })
    })
});

/**
 * Adds a click event listener to the "Options Page" link.
 * When clicked, it opens the extension's options page.
 */
const optionsPageLink = document.getElementById(OPTIONS_PAGE_LINK_ID);
if (optionsPageLink) {
    optionsPageLink.addEventListener("click", () => {
        openOptionsPage()
    });
}

/**
 * Adds a click event listener to the "Statistics Page" link.
 * When clicked, it opens the user statistics page.
 */
Array.from(document.getElementsByClassName(STATS_PAGE_LINK_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        openPage(STATS_PAGE_NAME)
    })
})

// Run the `checkActiveInterventions` function when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', checkActiveInterventions);

