export function getStoredTime(url) {
    return chrome.storage.local.get(url).then((result) => {
        return result[url]
    });
}
export function setTimeInStorage(url, time) {
    var urlTime = {};
    urlTime[url] = time
    return chrome.storage.local.set(urlTime).then(() => time);

}
export function resetTimeInStorage(url) {
    chrome.storage.local.remove(url);
}
export function getOrSetTime(url) {
    return getStoredTime(url).then((storedTime) => {
        if (storedTime == undefined) {
            var currentTime = new Date(Date.now() + twentyFourHours).toString()
            return setTimeInStorage(url, currentTime)
        };
        return storedTime
    })
}