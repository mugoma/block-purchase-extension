const twentyFourHours = 24 * 60 * 60000;
const DEFERRED_PURCHASES_STORE_KEY = "deferred_purchases"
const COMPLETED_PURCHASES_STORE_KEY = "completed_purchases"

function getStoredTime(url) {
    return chrome.storage.local.get(url).then((result) => {
        return result[url]
    });
}
function setTimeInStorage(url, time) {
    var urlTime = {};
    urlTime[url] = time
    return chrome.storage.local.set(urlTime).then(() => time);

}
function resetTimeInStorage(url) {
    return chrome.storage.local.remove(url).then(() => {
        var currentTime = new Date(Date.now() + twentyFourHours).toString()
        return setTimeInStorage(url, currentTime)
    });
}
function getOrSetTime(url) {
    return getStoredTime(url).then((storedTime) => {
        if (storedTime == undefined) {
            var currentTime = new Date(Date.now() + twentyFourHours).toString()
            return setTimeInStorage(url, currentTime)
        };
        return storedTime
    })
}
function sendMessageToContentScript(url, action, endTime = null, requestInitiator = 'popup') {
    return chrome.tabs.query({ url: url }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { initiator: requestInitiator, endTime: endTime, action: action });
    });
}
function recordPurchaseDeferment(url, wasDeferred) {
    var storageKey;
    if (wasDeferred === true) {
        storageKey = DEFERRED_PURCHASES_STORE_KEY
    } else if (wasDeferred === false) {
        storageKey = COMPLETED_PURCHASES_STORE_KEY;
    }
    return chrome.storage.local.get(storageKey).then((result) => {
        const storedResult = result[storageKey]
        var parsedResult;
        if (storedResult == undefined) {
            parsedResult = []
        } else {
            parsedResult = Array(...JSON.parse(storedResult))
        }
        parsedResult.push(url)
        const storeValue = {};
        storeValue[storageKey] = JSON.stringify(parsedResult)
        return chrome.storage.local.set(storeValue);
    })
}
export { getStoredTime, setTimeInStorage, resetTimeInStorage, getOrSetTime, sendMessageToContentScript, recordPurchaseDeferment };