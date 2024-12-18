// Time constant representing 24 hours in milliseconds
const twentyFourHours = 24 * 60 * 60000;
// Time constant representing 1 hour in milliseconds
const ONE_HOUR_IN_MILLISECONDS = 60 * 60000;
//Storage Keys for feedback information
const DEFERRED_PURCHASES_STORE_KEY = "deferred_purchases";
const COMPLETED_PURCHASES_STORE_KEY = "completed_purchases";
/**
 * Retrieves the stored time for a given URL from Chrome's local storage.
 *
 * @param {string} url - The URL associated with the stored time.
 * @returns {Promise<string|undefined>} A promise that resolves to the stored time or undefined if not found.
 */
function getStoredTime(url) {
    return chrome.storage.local.get(url).then((result) => {
        return result[url] === undefined ? undefined : result[url]['time'];
    });
}
/**
 * Sets a specific time for a given URL in Chrome's local storage.
 *
 * @param {string} url - The URL to associate with the stored time.
 * @param {string} time - The time to store for the URL.
 * @returns {Promise<string>} A promise that resolves to the stored time.
 */
function setTimeInStorage(url, time, price) {
    var urlData = {};
    urlData[url] = { time: time, amount: price }
    return chrome.storage.local.set(urlData).then(() => time);

}

/**
 * Resets the stored time for a given URL to 24 hours from the current time.
 *
 * @param {string} url - The URL whose timer needs to be reset.
 * @returns {Promise<string>} A promise that resolves to the new stored time.
 */
function resetTimeInStorage(url, price) {
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
function getOrSetTime(url, price) {
    return getStoredTime(url).then((storedTime) => {
        if (storedTime == undefined) {
            return getTimerDuration().then((timerDuration) => {
                var currentTime = new Date(Date.now() + timerDuration * ONE_HOUR_IN_MILLISECONDS).toString()
                return setTimeInStorage(url, currentTime, price)
            })
        };
        return storedTime['time']
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
function sendMessageToContentScript(url, action, endTime = null, requestInitiator = 'popup') {
    return chrome.tabs.query({ url: url }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { initiator: requestInitiator, endTime: endTime, action: action });
    });
}
/**
 * Records whether a purchase was deferred or completed in Chrome's local storage.
 *
 * @param {string} url - The URL associated with the purchase action.
 * @param {boolean} wasDeferred - True if the purchase was deferred, false if completed.
 * @returns {Promise<void>} A promise that resolves once the data is recorded.
 */
function recordPurchaseDeferment(url, wasDeferred, timerEndTime, price) {
    var storageKey;
    // Determine the appropriate storage key based on deferment status
    if (wasDeferred === true) {
        storageKey = DEFERRED_PURCHASES_STORE_KEY
    } else if (wasDeferred === false) {
        storageKey = COMPLETED_PURCHASES_STORE_KEY;
    }
    // Retrieve the existing data from storage and update it

    return chrome.storage.local.get(storageKey).then((result) => {
        const storedResult = result[storageKey]
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
        const storeValue = {};
        storeValue[storageKey] = JSON.stringify(parsedResult)
        return chrome.storage.local.set(storeValue);
    })
}
// Export functions to be used in other modules
export { getStoredTime, setTimeInStorage, resetTimeInStorage, getOrSetTime, sendMessageToContentScript, recordPurchaseDeferment };