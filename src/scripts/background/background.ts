// Import utility functions from the utils_chrome_api module
import { SET_TIMER_ACTION, RESET_TIMER_ACTION, DELETE_TIMER_ACTION, ADD_PURCHASE_TIMER_STAT_ACTION, REDIRECT_ACTION } from "../constants";
import { getOrSetTime, resetTimeInStorage, sendMessageToContentScript, recordPurchaseDeferment } from "../utils_chrome_api";
// Message Actions (constants representing various actions that can be handled)
/**
 * Listens for messages from other parts of the Chrome extension (such as content scripts).
 * Based on the action specified in the message, it performs the corresponding task.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // The origin or source of the request
    const requestInitiator = message.initiator
    // Handle the action to set a timer
    if (message.action === SET_TIMER_ACTION) {
        const [url, price] = [message.url, message.price]
        // Get the existing timer or set a new one if none exists
        getOrSetTime(url, price).then((endTime) => { sendResponse(endTime); return endTime })
            .then((endTime) => {
                // Notify the content script that the timer has been set
                sendMessageToContentScript(url, SET_TIMER_ACTION, endTime, requestInitiator);
            });
        // Handle the action to reset a timer
    } else if (message.action === RESET_TIMER_ACTION) {
        const [url, price] = [message.url, message.price]
        // Reset the timer in storage and respond with the new end time
        resetTimeInStorage(url, price).then((newEndTime: string) => { sendResponse(newEndTime); return newEndTime }).then((newEndTime: string) => {
            // Notify the content script that the timer has been reset
            sendMessageToContentScript(url, RESET_TIMER_ACTION, newEndTime, requestInitiator)
        });
    }
    // Handle the action to delete a timer    
    else if (message.action === DELETE_TIMER_ACTION) {
        const url = message.url;
        // Remove the timer associated with the URL from local storage
        chrome.storage.local.remove(url);
        sendResponse("Deleted")
        //Send to content script
        sendMessageToContentScript(url, DELETE_TIMER_ACTION, null, requestInitiator);
        // Handle the action to record a purchase deferment statistic
    } else if (message.action === ADD_PURCHASE_TIMER_STAT_ACTION) {
        const url = message.url
        const wasDeferred = message.wasDeferred
        const timerEndTime = message.timerEndTime
        const price = message.price
        // Record the purchase deferment and respond once completed
        recordPurchaseDeferment(url, wasDeferred, timerEndTime, price).then(() => { sendResponse("Completed") })

    } else if (message.action === REDIRECT_ACTION) {
        const url = message.url
        chrome.tabs.update(((undefined as unknown) as number), { url: url })

    }
    // Indicate that the response will be sent asynchronously
    return true;
});

/**
 * Opens the onboarding page when the extension is installed.
 */
chrome.runtime.onInstalled.addListener(function (object) {
    // Get the URL of the onboarding page
    let onboardingPageUrl = chrome.runtime.getURL("pages/onboarding.html");
    // Check if the installation event was due to a new install
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        // Open the onboarding page in a new tab
        chrome.tabs.create({ url: onboardingPageUrl });
    }
});