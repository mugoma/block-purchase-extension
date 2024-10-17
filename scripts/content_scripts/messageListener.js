const SET_TIMER_ACTION = 'set-timer';
const RESET_TIMER_ACTION = 'reset-timer';
const DELETE_TIMER_ACTION = 'delete-timer';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const action = request.action;
    const requestInitiator = request.initiator
    if (action !== null && requestInitiator == 'popup') {
        if (action == SET_TIMER_ACTION) {
            const endTime = request.endTime
            updatePageDOMWithTimerInterventions(AMZN_BUY_BTNS_IDS, [], endTime)
        } else if (action == DELETE_TIMER_ACTION) {
            removeTimerFromPage(AMZN_BUY_BTNS_IDS, ['dull-buy-btn'], [])
        } else if (action == RESET_TIMER_ACTION) {
            const endTime = request.endTime
            removeTimerFromPage(AMZN_BUY_BTNS_IDS, ['dull-buy-btn'], [])
            updatePageDOMWithTimerInterventions(AMZN_BUY_BTNS_IDS, [], endTime)

        }
    }
});