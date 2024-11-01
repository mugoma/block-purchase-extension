const SHEIN_PREV_ELEM_ID = "productIntroPrice"
//const SHEIN_ADD_TO_CART_ELEM_ID = "submit.add-to-cart"
const SHEIN_ADD_TO_CART_BNT_ELEM_ID = "ProductDetailAddBtn"
//const SHEIN_BUY_NOW_ELEM_ID = "submit.buy-now"
//const SHEIN_BUY_NOW_BNT_ELEM_ID = "buy-now-button"
const SHEIN_REVIEWS_DIV_CLASS = "common-reviews__list"
const SHEIN_STAR_RATING_DIV_ID = "acrPopover";
const SHEIN_BUY_BTNS_IDS = [
    //SHEIN_ADD_TO_CART_ELEM_ID,
    SHEIN_ADD_TO_CART_BNT_ELEM_ID,
    //SHEIN_BUY_NOW_ELEM_ID, 
    //SHEIN_BUY_NOW_BNT_ELEM_ID,
];

function addExtensionCTA() {
    const prevElem = document.getElementById(SHEIN_PREV_ELEM_ID);
    if (prevElem !== null) {
        prevElem.parentNode.insertBefore(createInPageCTAElement(), prevElem.nextSibling);
    }
}

function addExtensionCTACallback() {
    const ctaBtn = document.getElementById("cs_cta_btn");
    if (ctaBtn !== null) {
        ctaBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const ctaBtnHasTimer = ctaBtn.getAttribute("data-has-timer")
            if (ctaBtnHasTimer == 'false') {
                // Get url to use as key for storage
                const url = getCurrentURL()
                chrome.runtime.sendMessage({ action: 'set-timer', url: url, initiator: 'content-script' }).then((endTime) => {
                    updatePageDOMWithTimerInterventions(SHEIN_BUY_BTNS_IDS, [], endTime)
                })
                ctaBtn.setAttribute('data-has-timer', true)
            } else {
                //TODO: Add link to 'product' page
            }
        })
    }
}

function generateOverLayElement(targetDiv) {
    const starRating = document.getElementById(SHEIN_STAR_RATING_DIV_ID)?.innerText

    const revealText = "Click to Reveal"
    const overLayText = starRating ? starRating + revealText : revealText;

    const spoilerContainerDiv = document.createElement('div');
    spoilerContainerDiv.classList.add('spoiler-container');
    spoilerContainerDiv.classList.add('spoiler-container-blurred');

    const spoilerOverlay = document.createElement('div');
    spoilerOverlay.classList.add('spoiler-overlay');

    const spoilerTextSpan = document.createElement('span');
    spoilerTextSpan.classList.add("spoiler-text");
    spoilerTextSpan.innerText = overLayText;

    spoilerOverlay.appendChild(spoilerTextSpan);
    spoilerContainerDiv.appendChild(spoilerOverlay);

    spoilerOverlay.addEventListener('click', function () {
        this.classList.add('display-none')//.display = 'none'; // Hides the overlay
        this.parentElement.classList.add('spoiler-container-unblurred')//this.nextElementSibling.style.filter = 'none'; // Removes the blur effect on the text
        this.parentElement.classList.remove('spoiler-container-blurred')//this.nextElementSibling.style.filter = 'none'; // Removes the blur effect on the text
    });
    targetDiv.parentNode.insertBefore(spoilerContainerDiv, targetDiv);
    spoilerContainerDiv.appendChild(targetDiv);
}
function addOverlayToReviews(reviewsDivId) {
    const reviewsDiv = document.getElementsByClassName(reviewsDivId)
    if (reviewsDiv.length > 0) {
        console.log(reviewsDiv.length + " is the length")
        generateOverLayElement(reviewsDiv[0])
    } else {
        console.log("WHAT IS HAPPENING!")
    }
}
function addReducedSocialInfluence(reviewsDivId) {
    chrome.storage.local.get({ reviews: true }).then(
        (items) => {
            if (items.reviews == true) {
                addOverlayToReviews(reviewsDivId);
            }
        }
    );
}

function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function () {
        if (document.getElementById(name) !== null) {
            callback();
        } else {
            whenAvailable(name, callback);
        }
    }, interval);
}
function whenAvailable2(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function () {
        if (document.getElementsByClassName(name).length > 0) {
            callback();
        } else {
            whenAvailable2(name, callback);
        }
    }, interval);
}
whenAvailable(SHEIN_PREV_ELEM_ID, () => {
    // if (document.readyState !== 'loading') {
    //     console.log('document is already ready, just execute code here');
    //     addExtensionCTA();
    //     updatePageDOMIfTimerExists(SHEIN_BUY_BTNS_IDS, []);
    //     addExtensionCTACallback();
    // } else {
    // document.addEventListener('DOMContentLoaded', () => {
    addExtensionCTA();
    updatePageDOMIfTimerExists(SHEIN_BUY_BTNS_IDS, []);
    addExtensionCTACallback();
})
setEventListenerForMessages();
whenAvailable2(SHEIN_REVIEWS_DIV_CLASS, () => {
    addReducedSocialInfluence(SHEIN_REVIEWS_DIV_CLASS);
})
//}

//});