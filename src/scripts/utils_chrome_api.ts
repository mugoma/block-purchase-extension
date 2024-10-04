const twentyFourHours = 24 * 60 * 60000;
interface Map {
    [key: string]: string | undefined
}

export function getStoredTime(url: string) {
    return chrome.storage.local.get(url).then((result: { [x: string]: any; }) => {
        return result[url]
    });
}
export function setTimeInStorage(url: string | number, time: string) {
    var urlTime: Map = {};
    urlTime[url] = time
    return chrome.storage.local.set(urlTime).then(() => time);

}
export function resetTimeInStorage(url: string | number | (string | number)[]) {
    chrome.storage.local.remove(url);
}
export function getOrSetTime(url: any) {
    return getStoredTime(url).then((storedTime: undefined) => {
        if (storedTime == undefined) {
            var currentTime = new Date(Date.now() + twentyFourHours).toString()
            return setTimeInStorage(url, currentTime)
        };
        return storedTime
    })
}