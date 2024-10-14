const twentyFourHours = 24 * 60 * 60000;

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