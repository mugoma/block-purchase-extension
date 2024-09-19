const AMZN_PREV_ELEM_ID = "pmpux_feature_div"


function addExtensionCTA() {
    const prevElem = document.getElementById(AMZN_PREV_ELEM_ID);
    if (prevElem !== null) {
        prevElem.parentNode.insertBefore(createInPageCTAElement(), prevElem.nextSibling);
    }
}
addExtensionCTA()