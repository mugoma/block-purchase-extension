checkForExistingTimer();

document.getElementById(ADD_TIMER_BTN_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.runtime.sendMessage({ action: 'set-timer', url: url, initiator: 'popup' }).then((endTime) => {
            updateDOMwithCountDown(endTime)
        })
    });
})

document.getElementById(RESET_TIMER_BTN_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = getCurrentTabUrl(tabs);
        chrome.storage.local.remove(url).then(() => {
            removeExistingTimerInterval();
            chrome.runtime.sendMessage({ action: 'reset-timer', url: url, initiator: 'popup' }).then((endTime) => {
                updateDOMwithCountDown(endTime)
            })
        })
    });
})
document.getElementById(DELETE_TIMER_LINK_ID).addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        var url = getCurrentTabUrl(tabs);
        chrome.runtime.sendMessage({ action: 'delete-timer', url: url, initiator: 'popup' }).then(() => {
            removeExistingTimerInterval()
            toggleAddTimerContainerVisibility(true);
            toggleExistingTimerContainerVisibility(false);
        })
    })
})

document.getElementById(OPTIONS_PAGE_LINK_ID).addEventListener("click", () => {

})
function checkActiveInterventions() {
    chrome.storage.local.get({ timer: true }).then(
        (items) => {
            if (items.timer == true) {
                document.getElementById(ADD_TIMER_BTN_ID).classList.add(['dull-buy-btn'])
            }
        }
    );
}
document.addEventListener('DOMContentLoaded', checkActiveInterventions);
