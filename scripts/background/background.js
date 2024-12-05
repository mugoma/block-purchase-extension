import { getOrSetTime, resetTimeInStorage, sendMessageToContentScript, recordPurchaseDeferment } from "./utils_chrome_api.js";
// Message Actions
const SET_TIMER_ACTION = 'set-timer';
const RESET_TIMER_ACTION = 'reset-timer';
const DELETE_TIMER_ACTION = 'delete-timer';
const ADD_PURCHASE_TIMER_STAT = 'add-purchase-stat';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const requestInitiator = message.initiator
    if (message.action === SET_TIMER_ACTION) {
        console.log("Adding timer!")
        const url = message.url
        // Add timer if none. Avoid resetting the timer if action is initiated by the page CTA
        getOrSetTime(url).then((endTime) => { sendResponse(endTime); return endTime })
            .then((endTime) => {
                // Send to content script
                sendMessageToContentScript(url, SET_TIMER_ACTION, endTime, requestInitiator);
            });

    } else if (message.action === RESET_TIMER_ACTION) {
        console.log("Resetting timer!")
        const url = message.url
        resetTimeInStorage(url).then((newEndTime) => { sendResponse(newEndTime) }).then((newEndTime) => {
            //Send to content script
            sendMessageToContentScript(url, RESET_TIMER_ACTION, newEndTime, requestInitiator)
        });
    }
    else if (message.action === DELETE_TIMER_ACTION) {
        const url = message.url;
        chrome.storage.local.remove(url);
        sendResponse("Deleted")
        console.log("Deleting timer!")
        //Send to content script
        sendMessageToContentScript(url, DELETE_TIMER_ACTION, null, requestInitiator);

    } else if (message.action === ADD_PURCHASE_TIMER_STAT) {
        const url = message.url
        const wasDeferred = message.wasDeferred
        recordPurchaseDeferment(url, wasDeferred).then(() => { sendResponse("Completed") })

    }
    // Run asynchronously
    return true;
});

// Open onboarding page on installation
chrome.runtime.onInstalled.addListener(function (object) {
    let onboardingPageUrl = chrome.runtime.getURL("pages/onboarding.html");
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: onboardingPageUrl });
    }
});