import { extractProductPriceFromAmazonPage, removeTimerFromPage, updatePageDOMWithTimerInterventions } from "../utils";
import { AMZN_BUY_BTNS_IDS, DELETE_TIMER_ACTION, GET_PRODUCT_PRICE_ACTION, RESET_TIMER_ACTION, SET_TIMER_ACTION } from "../constants";


/**
 * Listens for messages sent to the background script and performs corresponding actions
 * to update or remove timers on the page based on the received request.
 *
 * @param {Object} request - The message object containing the action and additional data.
 * @param {Object} sender - The sender of the message (unused in this code).
 * @param {Function} sendResponse - Function to send a response back to the sender (unused here).
 */
export function listenForMessages() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // Extract the action type and request initiator from the message
        const action = request.action;
        const requestInitiator = request.initiator
        // Ensure the action is not null and the request is initiated from the popup
        if (action !== null && requestInitiator == 'popup') {
            if (action == SET_TIMER_ACTION) {
                // Handle setting a timer by updating the page DOM with timer interventions
                const endTime = request.endTime
                updatePageDOMWithTimerInterventions(AMZN_BUY_BTNS_IDS, [], endTime)
            } else if (action == DELETE_TIMER_ACTION) {
                // Handle deleting a timer by removing the timer from the page
                removeTimerFromPage(AMZN_BUY_BTNS_IDS, ['dull-buy-btn'], [])
            } else if (action == RESET_TIMER_ACTION) {
                // Handle resetting a timer by removing the existing timer and updating with a new timer
                const endTime = request.endTime
                removeTimerFromPage(AMZN_BUY_BTNS_IDS, ['dull-buy-btn'], [])
                updatePageDOMWithTimerInterventions(AMZN_BUY_BTNS_IDS, [], endTime)

            }
        } else if (action == GET_PRODUCT_PRICE_ACTION) {
            sendResponse(extractProductPriceFromAmazonPage())
        }
    });
}