const AMZN_PREV_ELEM_ID = "pmpux_feature_div"
const AMZN_ADD_TO_CART_ELEM_ID = "submit.add-to-cart"
const AMZN_ADD_TO_CART_BNT_ELEM_ID = "add-to-cart-button"
const AMZN_BUY_NOW_ELEM_ID = "submit.buy-now"
const AMZN_BUY_NOW_BNT_ELEM_ID = "buy-now-button"
const AMZN_BUY_BTNS_IDS = [AMZN_ADD_TO_CART_ELEM_ID, AMZN_ADD_TO_CART_BNT_ELEM_ID, AMZN_BUY_NOW_ELEM_ID, AMZN_BUY_NOW_BNT_ELEM_ID];

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
                greyOutBuyButtons(AMZN_BUY_BTNS_IDS,endTime,[])
            })

        })
    }
}


addExtensionCTA();
addExtensionCTACallback();
updatePageDOMIfTimerExists(AMZN_BUY_BTNS_IDS,[]);
