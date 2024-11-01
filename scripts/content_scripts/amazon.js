const AMZN_PREV_ELEM_ID = "pmpux_feature_div"
const AMZN_ADD_TO_CART_ELEM_ID = "submit.add-to-cart"
const AMZN_ADD_TO_CART_BNT_ELEM_ID = "add-to-cart-button"
const AMZN_BUY_NOW_ELEM_ID = "submit.buy-now"
const AMZN_BUY_NOW_BNT_ELEM_ID = "buy-now-button"
const AMZN_REVIEWS_DIV_ID = "customer-reviews_feature_div"
const AMZN_STAR_RATING_DIV_ID = "acrPopover";
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
            const ctaBtnHasTimer = ctaBtn.getAttribute("data-has-timer")
            if (ctaBtnHasTimer == 'false') {
                // Get url to use as key for storage
                const url = getCurrentURL()
                chrome.runtime.sendMessage({ action: 'set-timer', url: url, initiator: 'content-script' }).then((endTime) => {
                    updatePageDOMWithTimerInterventions(AMZN_BUY_BTNS_IDS, [], endTime)
                })
                ctaBtn.setAttribute('data-has-timer', true)
            } else {
                //TODO: Add link to 'product' page
            }
        })
    }
}
/*
    <div class="spoiler-overlay">
    <span class="spoiler-text">Spoilers ahead! Click to reveal.</span>
  </div>
*/
function generateOverLayElement(targetDiv) {
    const starRating = document.getElementById(AMZN_STAR_RATING_DIV_ID)?.innerText

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
    });
    targetDiv.parentNode.insertBefore(spoilerContainerDiv, targetDiv);
    spoilerContainerDiv.appendChild(targetDiv);
}
function addOverlayToReviews() {
    const reviewsDiv = document.getElementById(AMZN_REVIEWS_DIV_ID)
    if (reviewsDiv !== null) {
        generateOverLayElement(reviewsDiv)
    }
}
function addReducedSocialInfluence() {
    //document.addEventListener('DOMContentLoaded', () => {
        chrome.storage.local.get({ reviews: true }).then(
            (items) => {
                if (items.reviews == true) {
                    addOverlayToReviews();
                }
            }
        );
    //})
}

//document.addEventListener('DOMContentLoaded', () => {
console.log("I'll try to add stuff to the page!")
addExtensionCTA();
updatePageDOMIfTimerExists(AMZN_BUY_BTNS_IDS, []);
addExtensionCTACallback();
setEventListenerForMessages();
addReducedSocialInfluence();
//});