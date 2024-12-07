// Constant representing 24 hours in milliseconds (24 * 60 minutes * 60,000 milliseconds)
const twentyFourHours = 24 * 60 * 60000;

/**
 * Retrieves the stored time associated with a given URL from Chrome's local storage.
 *
 * @param {string} url - The URL used as the key to retrieve the stored time.
 * @returns {Promise<string|undefined>} A promise that resolves to the stored time or undefined if no time is found.
 */
function getStoredTime(url) {
    return chrome.storage.local.get(url).then((result) => {
        return result[url]
    });
}

/**
 * Sets a specific time for a given URL in Chrome's local storage.
 *
 * @param {string} url - The URL to associate with the stored time.
 * @param {string} time - The time string to store.
 * @returns {Promise<string>} A promise that resolves to the stored time after saving it.
 */
function setTimeInStorage(url, time) {
    var urlTime = {};
    urlTime[url] = time
    return chrome.storage.local.set(urlTime).then(() => time);

}
/**
 * Resets the stored time for a given URL to 24 hours from the current time.
 *
 * @param {string} url - The URL whose timer needs to be reset.
 * @returns {Promise<string>} A promise that resolves to the new stored time after resetting it.
 */
function resetTimeInStorage(url) {
    return chrome.storage.local.remove(url).then(() => {
        var currentTime = new Date(Date.now() + twentyFourHours).toString()
        return setTimeInStorage(url, currentTime)
    });
}
/**
 * Retrieves the stored time for a given URL or sets a new time (24 hours from now) if none exists.
 *
 * @param {string} url - The URL to retrieve or set the stored time for.
 * @returns {Promise<string>} A promise that resolves to the stored or newly set time.
 */
function getOrSetTime(url) {
    return getStoredTime(url).then((storedTime) => {
        // If no time is stored, set a new time 24 hours from now
        if (storedTime == undefined) {
            var currentTime = new Date(Date.now() + twentyFourHours).toString()
            return setTimeInStorage(url, currentTime)
        };
        return storedTime
    })
}

/**
 * Sets up a listener for messages sent to the background script.
 * This is a placeholder function demonstrating how to send a message.
 */
function setEventListenerForMessages() {
    // chrome.runtime.onMessage((message)=>{
    //     alert("Got the message", message)
    // })
    chrome.runtime.sendMessage("Hi")
}