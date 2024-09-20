const AMZN_PREV_ELEM_ID = "pmpux_feature_div"
const AMZN_ADD_TO_CART_ELEM_ID = "submit.add-to-cart"
const AMZN_ADD_TO_CART_BNT_ELEM_ID = "add-to-cart-button"

function addExtensionCTA() {
    const prevElem = document.getElementById(AMZN_PREV_ELEM_ID);
    if (prevElem !== null) {
        prevElem.parentNode.insertBefore(createInPageCTAElement(), prevElem.nextSibling);
    }
}

function addExtensionCTACallback() {
    const ctaBtn = document.getElementById("cs_cta_btn");
    if (ctaBtn !== null) {
        ctaBtn.addEventListener("click", (e) => {
            e.preventDefault()
            // Get url to use as key for storage
            const url = getCurrentURL()
            chrome.runtime.sendMessage({ action: 'set-timer', url: url }).then((endTime) => {
                greyOutBuyButton(endTime)
            })

        })
    }
}
function greyOutBuyButton(endTime) {
    changeBuyButtonStyling(AMZN_ADD_TO_CART_ELEM_ID, endTime, [])
    changeBuyButtonStyling(AMZN_ADD_TO_CART_BNT_ELEM_ID, endTime, [])
}
function updatePageDOMIfTimerExists() {
    getStoredTime(getCurrentURL()).then((storedTime) => {
        if (storedTime !== undefined) {
            greyOutBuyButton(storedTime)
            createCountdownTimer(storedTime, CS_CTA_BTN_ID, '', true)
        }
    })
}

addExtensionCTA();
addExtensionCTACallback();
updatePageDOMIfTimerExists();
