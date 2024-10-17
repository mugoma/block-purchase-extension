const SET_TIMER_ACTION = 'set-timer';
const RESET_TIMER_ACTION = 'reset-timer';
const DELETE_TIMER_ACTION = 'delete-timer';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request.endTime);
    let action = request.action;
    if (action !== null) {
        if (action == SET_TIMER_ACTION) {
            const endTime = request.endTime
            updatePageDOMWithTimerInterventions(AMZN_BUY_BTNS_IDS, [], endTime)
        }else if(action == DELETE_TIMER_ACTION){

        }
    }
});