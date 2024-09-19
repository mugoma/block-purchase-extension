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
    ctaButton.setAttribute("id", "cs_cta_btn")

    //ctaButton.appendChild(ctaButtonImg)
    ctaDiv.appendChild(ctaButton)

    return ctaDiv
}

