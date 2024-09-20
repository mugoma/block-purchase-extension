const AMZN_PREV_ELEM_ID = "pmpux_feature_div"
const AMZN_ADD_TO_CART_ELEM_ID = "submit.add-to-cart"

function addExtensionCTA() {
    const prevElem = document.getElementById(AMZN_PREV_ELEM_ID);
    if (prevElem !== null) {
        prevElem.parentNode.insertBefore(createInPageCTAElement(), prevElem.nextSibling);
    }
}
function getCurrentURL() {
    return window.location.href
}
function addExtensionCTACallback() {
    const ctaBtn = document.getElementById("cs_cta_btn");
    if (ctaBtn !== null) {
        ctaBtn.addEventListener("click", (e) => {
            e.preventDefault()
            // Get url to use as key for storage
            const url = getCurrentURL()
            chrome.runtime.sendMessage({ action: 'set-timer', url: url })

        })
    }
}
addExtensionCTA();
addExtensionCTACallback();