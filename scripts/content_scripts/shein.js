// IDs and Classes for various SHEIN elements used in the extension
const SHEIN_PREV_ELEM_ID = "productIntroPrice"
//const SHEIN_ADD_TO_CART_ELEM_ID = "submit.add-to-cart"
const SHEIN_ADD_TO_CART_BNT_ELEM_ID = "ProductDetailAddBtn"
//const SHEIN_BUY_NOW_ELEM_ID = "submit.buy-now"
//const SHEIN_BUY_NOW_BNT_ELEM_ID = "buy-now-button"
const SHEIN_REVIEWS_DIV_CLASS = "common-reviews__list"
const SHEIN_STAR_RATING_DIV_ID = "acrPopover";
// Array of SHEIN "Buy" button IDs
const SHEIN_BUY_BTNS_IDS = [
    //SHEIN_ADD_TO_CART_ELEM_ID,
    SHEIN_ADD_TO_CART_BNT_ELEM_ID,
    //SHEIN_BUY_NOW_ELEM_ID, 
    //SHEIN_BUY_NOW_BNT_ELEM_ID,
];
/**
 * Adds a Call-to-Action (CTA) button to the SHEIN product page.
 * Inserts the button after the element specified by `SHEIN_PREV_ELEM_ID`.
 */
function addExtensionCTA() {
    const prevElem = document.getElementById(SHEIN_PREV_ELEM_ID);
    if (prevElem !== null) {
        // Insert the CTA button after the specified element

        prevElem.parentNode.insertBefore(createInPageCTAElement(), prevElem.nextSibling);
    }
}

/**
 * Adds a click event listener to the CTA button.
 * When clicked, it sets a timer and updates the page DOM if no timer exists.
 */
function addExtensionCTACallback() {
    const ctaBtn = document.getElementById("cs_cta_btn");
    if (ctaBtn !== null) {
        ctaBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const ctaBtnHasTimer = ctaBtn.getAttribute("data-has-timer")
            if (ctaBtnHasTimer == 'false') {
                // Get the current URL to use as a key for storage
                const url = getCurrentURL()
                chrome.runtime.sendMessage({ action: 'set-timer', url: url, initiator: 'content-script' }).then((endTime) => {
                    // Update the page with timer-related interventions

                    updatePageDOMWithTimerInterventions(SHEIN_BUY_BTNS_IDS, [], endTime)
                })
                // Set the attribute to indicate a timer has been set

                ctaBtn.setAttribute('data-has-timer', true)
            } else {
                //TODO: Add link to 'product' page
            }
        })
    }
}

/**
 * Generates a spoiler overlay element to hide content, allowing users to click and reveal it.
 *
 * @param {HTMLElement} targetDiv - The target div element to apply the overlay to.
 */
function generateOverLayElement(targetDiv) {
    // Get the star rating text from the star rating element

    const starRating = document.getElementById(SHEIN_STAR_RATING_DIV_ID)?.innerText

    // Overlay text to display on the spoiler overlay
    const revealText = "Click to Reveal"
    const overLayText = starRating ? starRating + revealText : revealText;

    // Create the container div for the spoiler
    const spoilerContainerDiv = document.createElement('div');
    spoilerContainerDiv.classList.add('spoiler-container');
    spoilerContainerDiv.classList.add('spoiler-container-blurred');

    // Create the overlay div
    const spoilerOverlay = document.createElement('div');
    spoilerOverlay.classList.add('spoiler-overlay');

    // Create the span for overlay text
    const spoilerTextSpan = document.createElement('span');
    spoilerTextSpan.classList.add("spoiler-text");
    spoilerTextSpan.innerText = overLayText;

    // Append the text span to the overlay
    spoilerOverlay.appendChild(spoilerTextSpan);
    spoilerContainerDiv.appendChild(spoilerOverlay);

    // Add click event to remove the overlay and blur effect
    spoilerOverlay.addEventListener('click', function () {
        this.classList.add('display-none')//.display = 'none'; // Hides the overlay
        this.parentElement.classList.add('spoiler-container-unblurred')//this.nextElementSibling.style.filter = 'none'; // Removes the blur effect on the text
        this.parentElement.classList.remove('spoiler-container-blurred')//this.nextElementSibling.style.filter = 'none'; // Removes the blur effect on the text
    });
    // Insert the spoiler container before the target div and append the target div to it
    targetDiv.parentNode.insertBefore(spoilerContainerDiv, targetDiv);
    spoilerContainerDiv.appendChild(targetDiv);
}

/**
 * Adds a spoiler overlay to the reviews section of the SHEIN product page.
 *
 * @param {string} reviewsDivId - The class name of the reviews container.
 */
function addOverlayToReviews(reviewsDivId) {
    const reviewsDiv = document.getElementsByClassName(reviewsDivId)
    if (reviewsDiv.length > 0) {
        console.log(reviewsDiv.length + " is the length")
        generateOverLayElement(reviewsDiv[0])
    } else {
        console.log("WHAT IS HAPPENING!")
    }
}

/**
 * Adds reduced social influence by overlaying the reviews if the feature is enabled in storage.
 *
 * @param {string} reviewsDivId - The class name of the reviews container.
 */
function addReducedSocialInfluence(reviewsDivId) {
    chrome.storage.local.get({ reviews: true }).then(
        (items) => {
            if (items.reviews == true) {
                addOverlayToReviews(reviewsDivId);
            }
        }
    );
}
/**
 * Repeatedly checks if an element with a given ID is available, then calls a callback function.
 *
 * @param {string} name - The ID of the element to check for.
 * @param {Function} callback - The function to execute when the element is available.
 */
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

/**
 * Repeatedly checks if an element with a given class name is available, then calls a callback function.
 *
 * @param {string} name - The class name of the element to check for.
 * @param {Function} callback - The function to execute when the element is available.
 */
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
// Initialize the extension's CTA button and related functionality when the element is available
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
// Set up event listeners for messages from the background script
setEventListenerForMessages();
// Add reduced social influence functionality when the reviews section is available
whenAvailable2(SHEIN_REVIEWS_DIV_CLASS, () => {
    addReducedSocialInfluence(SHEIN_REVIEWS_DIV_CLASS);
})
//}

//});