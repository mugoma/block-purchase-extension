checkForExistingTimer();

document.getElementById(ADD_TIMER_BTN_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.runtime.sendMessage({ action: 'set-timer', url: url }).then((endTime) => {
            updateDOMwithCountDown(endTime)
        })
        //handleCountDown(url, currentTime)
        // Send message to content script

    });
})

document.getElementById(RESET_TIMER_BTN_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.storage.local.remove(url).then(() => {
            let currentTime = new Date(Date.now() + twentyFourHours);
            clearInterval(intervalId);
            handleCountDown(url, currentTime);
            // Send message to content script
        })
    });
})
document.getElementById(DELETE_TIMER_LINK_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        var url = getCurrentTabUrl(tabs);
        chrome.runtime.sendMessage({ action: 'delete-timer', url: url }).then((response) => {
            clearInterval(intervalId);
            toggleAddTimerContainerVisibility(true);
            toggleExistingTimerContainerVisibility(false);
        })
    })
})