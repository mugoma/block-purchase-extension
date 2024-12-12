// Call to check if a timer already exists for the current tab when the script loads
checkForExistingTimer();

function setTimeUsingBackgroundProcess(action = 'set-timer', url, price) {
    return chrome.runtime.sendMessage({ action: action, url: url, initiator: 'popup', price: price })
}

/**
 * Adds a click event listener to the "Add Timer" button.
 * When clicked, it sets a timer for the current tab's URL and updates the DOM with the countdown timer.
 */
document.getElementById(ADD_TIMER_BTN_ID).addEventListener("click", () => {
    // Get the current page's url and product price concurrently
    Promise.all([getCurrentUrl(), getProductPriceFromPage()]).then((results) => {
        const [url, price] = results
        // Send a message to set a timer and update the DOM with the countdown
        setTimeUsingBackgroundProcess('set-timer', url, price).then((endTime) => {
            updateDOMwithCountDown(endTime)
        })
    });
})
/**
 * Get the url of the tab that is currently open in the browser. 
 * @returns {Promise<string>}
 */
function getCurrentUrl() {
    return chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        return getCurrentTabUrl(tabs);
    })
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
        Promise.all([getCurrentUrl(), getProductPriceFromPage()]).then((results) => {
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
document.getElementById(DELETE_TIMER_LINK_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        var url = getCurrentTabUrl(tabs);
        // Send a message to delete the timer and update the DOM accordingly
        chrome.runtime.sendMessage({ action: 'delete-timer', url: url, initiator: 'popup' }).then(() => {
            removeExistingTimerInterval()
            toggleAddTimerContainerVisibility(true);
            toggleExistingTimerContainerVisibility(false);
        })
    })
})

/**
 * Adds click event listeners to all elements with the "Purchase Feedback" button class.
 * When clicked, it records whether a purchase was deferred or completed,
 * and updates the feedback sections in the DOM accordingly.
 */
Array.from(document.getElementsByClassName(PURCHASE_FEEDBACK_BTNS_CLASS)).forEach(element => {
    element.addEventListener("click", (event) => {
        getCurrentUrl().then((url) => {
            // Determine if the purchase was deferred based on the button's dataset
            getUrlData(url).then((urlData) => {
                const [timerEndTime, price] = [urlData['time'], urlData['price']]
                const wasDeferred = event.target.dataset.proceededWithPurchase === "y" ? false : true;
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
document.getElementById(OPTIONS_PAGE_LINK_ID).addEventListener("click", () => {
    openOptionsPage()
})

/**
 * Adds a click event listener to the "Statistics Page" link.
 * When clicked, it opens the user statistics page.
 */
Array.from(document.getElementsByClassName(STATS_PAGE_LINK_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        openPage(STATS_PAGE_NAME)
    })
})
/**
 * Changes 'add timer' button styling and text to match disabled status. 
 */
function handleTimerDisabled() {
    document.getElementById(ADD_TIMER_BTN_ID).classList.add(['dull-buy-btn'])
    document.getElementById(ADD_TIMER_BTN_ID).disabled = true
    document.getElementById(ADD_TIMER_BTN_ID).title = "Timer is disabled. Visit the options page to enable it."
}
/**
 * Change UI when timer is enabled.
 * Change 'add-timer' text to match user reflection period. 
 * @param {int} timerDuration Time in hours of the timer countdown
 */
function handleTimerEnabled(timerDuration) {
    const timerButtonText = `Yes! Add ${timerDuration} Hour countdown`
    document.getElementById(ADD_TIMER_BTN_ID).innerText = timerButtonText
    document.getElementById(ADD_TIMER_BTN_ID).classList.add(['background-brown'])

}
/**
 * Checks if any active interventions (timers) exist in storage.
 * If a timer exists, it updates the "Add Timer" button's styling to indicate its disabled state.
 */
function checkActiveInterventions() {
    chrome.storage.local.get({ timer: true, timerDuration: 24 }).then(
        (items) => {
            console.log(items)
            if (items.timer === false) {
                console.log("changing the information for the user")
                //TODO: Add message informing user the intervention is disabled
                handleTimerDisabled()
            } else {
                handleTimerEnabled(items.timerDuration)
            }
        }
    );
}
function getProductPriceFromPage() {
    return chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        var activeTab = tabs[0];
        return chrome.tabs.sendMessage(activeTab.id, { action: "get-product-price" }).then((price) => price, () => 0);
    });
}
// Run the `checkActiveInterventions` function when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', checkActiveInterventions);
