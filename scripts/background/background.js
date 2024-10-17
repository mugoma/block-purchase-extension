import { getOrSetTime, resetTimeInStorage, sendMessageToContentScript } from "./utils_chrome_api.js";

const SET_TIMER_ACTION = 'set-timer';
const RESET_TIMER_ACTION = 'reset-timer';
const DELETE_TIMER_ACTION = 'delete-timer';
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender)
    if (message.action === SET_TIMER_ACTION) {
        console.log("Adding timer!")
        const url = message.url
        // Add timer if none. Avoid resetting the timer if action is initiated by the page CTA
        getOrSetTime(url).then((endTime) => { sendResponse(endTime); return endTime })
            .then((endTime) => {
                // Send to content script
                sendMessageToContentScript(url, SET_TIMER_ACTION, endTime);
            });

    } else if (message.action === RESET_TIMER_ACTION) {
        console.log("Resetting timer!")
        const url = message.url
        resetTimeInStorage(url).then((time) => { sendResponse(time) }).then(() => {
            // TODO: Send to content script
        });
    }
    else if (message.action === DELETE_TIMER_ACTION) {
        const url = message.url;
        chrome.storage.local.remove(url);
        sendResponse("Deleted")
        console.log("Deleting timer!")
        //TODO: Send to content script
        sendMessageToContentScript(url, DELETE_TIMER_ACTION);

    }
    // Run asynchronously
    return true;
});