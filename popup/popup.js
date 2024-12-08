// Call to check if a timer already exists for the current tab when the script loads
checkForExistingTimer();

/**
 * Adds a click event listener to the "Add Timer" button.
 * When clicked, it sets a timer for the current tab's URL and updates the DOM with the countdown timer.
 */
document.getElementById(ADD_TIMER_BTN_ID).addEventListener("click", () => {
    // Query the currently active tab in the current window

    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        // Send a message to set a timer and update the DOM with the countdown
        chrome.runtime.sendMessage({ action: 'set-timer', url: url, initiator: 'popup' }).then((endTime) => {
            updateDOMwithCountDown(endTime)
        })
    });
})
/**
 * Adds click event listeners to all elements with the "Reset Timer" button class.
 * When clicked, it resets the timer for the current tab's URL, removes the existing timer interval,
 * and updates the DOM with the new countdown timer.
 */
Array.from(document.getElementsByClassName(RESET_TIMER_BTNS_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const url = getCurrentTabUrl(tabs);
            // Remove the timer from storage and reset the timer interval
            //TODO: Remove the duplication
            chrome.storage.local.remove(url).then(() => {
                removeExistingTimerInterval();
                // Send a message to reset the timer and update the DOM with the new countdown
                chrome.runtime.sendMessage({ action: 'reset-timer', url: url, initiator: 'popup' }).then((endTime) => {
                    updateDOMwithCountDown(endTime)
                })
            })
        });
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
        chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            var url = getCurrentTabUrl(tabs);
            // TODO: Streamline this logic
            // Determine if the purchase was deferred based on the button's dataset
            getStoredTime(url).then((timerEndTime) => {
                const wasDeferred = event.target.dataset.proceededWithPurchase === "y" ? false : true;
                chrome.runtime.sendMessage(
                    {
                        action: 'add-purchase-stat', url: url, initiator: 'popup',
                        wasDeferred: wasDeferred, timerEndTime: timerEndTime
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
})})
/**
 * Checks if any active interventions (timers) exist in storage.
 * If a timer exists, it updates the "Add Timer" button's styling to indicate its disabled state.
 */
function checkActiveInterventions() {
    chrome.storage.local.get({ timer: true }).then(
        (items) => {
            if (items.timer == true) {
                //TODO: Add message informing user the intervention is disabled
                document.getElementById(ADD_TIMER_BTN_ID).classList.add(['dull-buy-btn'])
            }
        }
    );
}
// Run the `checkActiveInterventions` function when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', checkActiveInterventions);
