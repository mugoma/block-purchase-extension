import { DEFERRED_PURCHASES_STORE_KEY, COMPLETED_PURCHASES_STORE_KEY } from "./constants";

// Time constant representing 24 hours in milliseconds
const twentyFourHours = 24 * 60 * 60000;
// Time constant representing 1 hour in milliseconds
const ONE_HOUR_IN_MILLISECONDS = 60 * 60000;
//Storage Keys for feedback information
// const DEFERRED_PURCHASES_STORE_KEY:string = "deferred_purchases";
// const COMPLETED_PURCHASES_STORE_KEY:string = "completed_purchases";

/**
 * Retrieves the information associated with a given URL from Chrome's local storage. 
 * @param {string} url The URL used as a key to retrieve the stored time
 * @returns {Promise<Object>}
 */
export function getUrlData(url: string ) {
    return new Promise((resolve) => {
        chrome.storage.local.get(url, (result) => {
            resolve(result[url]);
        });
    });
}

/**
 * Retrieves the stored time associated with a given URL from Chrome's local storage.
 *
 * @param {string} url - The URL used as the key to retrieve the stored time.
 * @returns {Promise<string|undefined>} A promise that resolves to the stored time or undefined if no time is found.
 */
export function getStoredTime(url: string) {
    return new Promise((resolve) => {
        chrome.storage.local.get(url, (result) => {
            resolve(result[url] === undefined ? undefined : result[url]['time']);
        });
    });
}

/**
 * Sets a specific time for a given URL in Chrome's local storage.
 *
 * @param {string} url - The URL to associate with the stored time.
 * @param {string} time - The time to store for the URL.
 * @returns {Promise<string>} A promise that resolves to the stored time.
 */
function setTimeInStorage(url: string , time: string, price: any) {
    var urlData: { [key: string]: { time: string, amount: any } } = {};
    urlData[url] = { time: time, amount: price }
    return chrome.storage.local.set(urlData).then(() => time);

}

/**
 * Resets the stored time for a given URL to 24 hours from the current time.
 *
 * @param {string} url - The URL whose timer needs to be reset.
 * @returns {Promise<string>} A promise that resolves to the new stored time.
 */
export function resetTimeInStorage(url: string , price: any) {
    return chrome.storage.local.remove(url).then(() => {
        return getTimerDuration().then((timerDuration) => {
            var currentTime = new Date(Date.now() + timerDuration * ONE_HOUR_IN_MILLISECONDS).toString()
            return setTimeInStorage(url, currentTime, price)
        })
    });
}
function getTimerDuration() {
    return chrome.storage.local.get({ timerDuration: 24 }).then((result) => {
        return result['timerDuration']
    });
}

/**
 * Retrieves the stored time for a given URL or sets a new time (24 hours from now) if none exists.
 *
 * @param {string} url - The URL to retrieve or set the stored time for.
 * @returns {Promise<string>} A promise that resolves to the stored or newly set time.
 */
export function getOrSetTime(url: any, price: any) {
    return getStoredTime(url).then((storedTime) => {

        if (storedTime == undefined) {
            return getTimerDuration().then((timerDuration) => {
                var currentTime = new Date(Date.now() + timerDuration * ONE_HOUR_IN_MILLISECONDS).toString()
                return setTimeInStorage(url, currentTime, price)
            })
        };
        if (typeof storedTime === 'object' && storedTime !== null && 'time' in storedTime) {
            return storedTime.time;
        }
        return storedTime;
    })
}

/**
 * Sends a message to the content script associated with the specified URL.
 *
 * @param {string} url - The URL to identify the tab to send the message to.
 * @param {string} action - The action type to send to the content script.
 * @param {string|null} [endTime=null] - The end time associated with the timer (optional).
 * @param {string} [requestInitiator='popup'] - The source initiating the request (default is 'popup').
 */
export function sendMessageToContentScript(url: any, action: string, endTime: string | null|any, requestInitiator = 'popup') {
    return chrome.tabs.query({ url: url }, function (tabs) {
        if (tabs[0] && tabs[0].id !== undefined) {
            chrome.tabs.sendMessage(tabs[0].id, { initiator: requestInitiator, endTime: endTime, action: action });
        }
    });
}
/**
 * Records whether a purchase was deferred or completed in Chrome's local storage.
 *
 * @param {string} url - The URL associated with the purchase action.
 * @param {boolean} wasDeferred - True if the purchase was deferred, false if completed.
 * @returns {Promise<void>} A promise that resolves once the data is recorded.
 */
export function recordPurchaseDeferment(url: any, wasDeferred: boolean, timerEndTime: any, price: any) {
    var storageKey: string ;
    // Determine the appropriate storage key based on deferment status
    if (wasDeferred === true) {
        storageKey = DEFERRED_PURCHASES_STORE_KEY
    } else {
        storageKey = COMPLETED_PURCHASES_STORE_KEY;
    }
    // Retrieve the existing data from storage and update it

    return new Promise((resolve) => {
        chrome.storage.local.get(storageKey, (result) => {
            resolve(result);
        });
    }).then((result) => {
        const storedResult = (result as { [key: string]: string })[storageKey]
        var parsedResult;
        // Initialize with an empty array if no data exists
        if (storedResult == undefined) {
            parsedResult = []
        } else {
            parsedResult = Array(...JSON.parse(storedResult))
        }
        // Add the URL to the appropriate list
        parsedResult.unshift({ url: url, timerEndTime: timerEndTime, price: price })
        // Store the updated list back to local storage
        const storeValue: { [key: string]: string } = {};
        storeValue[storageKey] = JSON.stringify(parsedResult)
        return chrome.storage.local.set(storeValue);
    })
}