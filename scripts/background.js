const SET_TIMER_ACTION = 'set-timer'
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === SET_TIMER_ACTION) {
        const url = message.url
        // Add timer if none. 
        chrome.storage.local.get(url).then((result) => {
            var storedTime = result[url]
            if (storedTime == undefined) {
                var urlTime = {};
                urlTime[url] = new Date(Date.now() + (24 * 60 * 60000)).toString()
                chrome.storage.local.set(urlTime)
            };
        });
    }
});