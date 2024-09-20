const CS_CTA_BTN_ID = "cs_cta_btn"
function createInPageCTAElement() {
    // Image URL
    let hourglassImageURL = chrome.runtime.getURL("images/hourglass.png");
    // Div
    const ctaDiv = document.createElement("div");
    // Button
    const ctaButton = document.createElement("button");
    //Image
    //const ctaButtonImg = document.createElement("img");
    //ctaButtonImg.setAttribute("src", hourglassImageURL)
    ctaButton.innerHTML = "B"
    ctaButton.setAttribute("id", CS_CTA_BTN_ID)

    //ctaButton.appendChild(ctaButtonImg)
    ctaDiv.appendChild(ctaButton)

    return ctaDiv
}
function changeBuyButtonStyling(buyButtonId, endTime, cssClassesToRemove = []) {
    const buyButtonElem = document.getElementById(buyButtonId);
    if (buyButtonElem != null) {
        // Make the button gray with white text
        if (cssClassesToRemove.length > 0) {
            buyButtonElem.classList.remove(cssClassesToRemove);
        }
        buyButtonElem.classList.add(['dull-buy-btn'])
        // Add tooltip on when timer will end
        const titleText = "Timer will end at " + new Date(endTime).toLocaleString()
        buyButtonElem.setAttribute("title", titleText)
    }
}

function setClickEventListenerToElement(element, callback) {
    element.addEventListener("click", () => {
        callback()
    })
}
function getStoredTime(url) {
    return chrome.storage.local.get(url).then((result) => {
        return result[url]
    });
}

