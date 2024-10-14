import { getOrSetTime, resetTimeInStorage } from "./utils_chrome_api.js";

const SET_TIMER_ACTION = 'set-timer';
const RESET_TIMER_ACTION = 'reset-timer';
const DELETE_TIMER_ACTION = 'delete-timer';
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender)
    if (message.action === SET_TIMER_ACTION) {
        const url = message.url
        // Add timer if none. Avoid resetting the timer if action is initiated by the page CTA
        getOrSetTime(url).then((time) => { sendResponse(time) }).then(()=>{
            // Send to content script

        });

    } else if (message.action === RESET_TIMER_ACTION) {
        const url = message.url
        resetTimeInStorage(url).then((time) => { sendResponse(time) }).then(()=>{
            // Send to content script
        });
    }
    else if (message.action === DELETE_TIMER_ACTION) {
        const url = message.url;
        chrome.storage.local.remove(url);
        sendResponse("Deleted").then(()=>{
            // Send to content script
        });
    }
    // Run asynchronously
    return true;
});