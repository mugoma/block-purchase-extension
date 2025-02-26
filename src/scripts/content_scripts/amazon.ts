import { createInPageCTAElement, getCurrentURL, updatePageDOMIfTimerExists, updatePageDOMWithTimerInterventions } from "../utils";
// IDs of various Amazon elements used in the extension
const AMZN_PREV_ELEM_ID = "pmpux_feature_div"
const AMZN_ADD_TO_CART_ELEM_ID = "submit.add-to-cart"
const AMZN_ADD_TO_CART_BNT_ELEM_ID = "add-to-cart-button"
const AMZN_BUY_NOW_ELEM_ID = "submit.buy-now"
const AMZN_BUY_NOW_BNT_ELEM_ID = "buy-now-button"
const AMZN_REVIEWS_DIV_ID = "customer-reviews_feature_div"
const AMZN_STAR_RATING_DIV_ID = "acrPopover";
const AMZN_PRICE_INPUT_FIELD_ID = 'attach-base-product-price';

// Array of Amazon "Buy" button IDs
export const AMZN_BUY_BTNS_IDS = [AMZN_ADD_TO_CART_ELEM_ID, AMZN_ADD_TO_CART_BNT_ELEM_ID, AMZN_BUY_NOW_ELEM_ID, AMZN_BUY_NOW_BNT_ELEM_ID];

/**
 * Adds a Call-to-Action (CTA) button to the Amazon product page.
 * Inserts the button after the element specified by `AMZN_PREV_ELEM_ID`.
 */
function addAmazonPageCTA() {
    const prevElem = document.getElementById(AMZN_PREV_ELEM_ID);
    if (prevElem !== null && prevElem.parentNode !== null) {
        // Insert the CTA button after the specified element
        prevElem.parentNode.insertBefore(createInPageCTAElement(), prevElem.nextSibling);
    }
}

/**
 * Adds a click event listener to the CTA button.
 * When clicked, it sets a timer and updates the page DOM if no timer exists.
 */
function addAmazonPageCTACallback() {
    const ctaBtn = document.getElementById("cs_cta_btn");
    if (ctaBtn !== null) {
        ctaBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const ctaBtnHasTimer = ctaBtn.getAttribute("data-has-timer")
            if (ctaBtnHasTimer == 'false') {
                // Get the current URL to use as a key for storage
                const url = getCurrentURL()
                chrome.runtime.sendMessage({ action: 'set-timer', url: url, initiator: 'content-script', price: extractProductPriceFromPage() }).then((endTime) => {
                    // Update the page with timer-related interventions
                    updatePageDOMWithTimerInterventions(AMZN_BUY_BTNS_IDS, [], endTime)
                })
                // Set the attribute to indicate a timer has been set
                ctaBtn.setAttribute('data-has-timer', 'true')
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
function generateOverLayElement(targetDiv: HTMLElement) {
    // Get the star rating text from the star rating element
    const starRating = document.getElementById(AMZN_STAR_RATING_DIV_ID)?.innerText

    // Overlay text to display on the spoiler overlay
    const revealText = "Click to Reveal"
    const overLayText = starRating ? starRating + revealText : revealText;

    // Create the container div for the spoiler
    const spoilerContainerDiv = document.createElement('div');
    //TODO: Combine the two lines below
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
        this.classList.add('display-none')// Hides the overlay
        if (this.parentElement !== null) {
            this.parentElement.classList.remove(...['spoiler-container-blurred']) // Removes the blur effect on the text
        }
    });
    // Insert the spoiler container before the target div and append the target div to it
    if (targetDiv.parentNode !== null) {
        targetDiv.parentNode.insertBefore(spoilerContainerDiv, targetDiv);
    }
    spoilerContainerDiv.appendChild(targetDiv);
}
/**
 * Adds a spoiler overlay to the reviews section of the Amazon product page.
 */
function addOverlayToReviews() {
    const reviewsDiv = document.getElementById(AMZN_REVIEWS_DIV_ID)
    if (reviewsDiv !== null) {
        generateOverLayElement(reviewsDiv)
    }
}
/**
 * Adds reduced social influence by overlaying the reviews if the feature is enabled in storage.
 */
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
export function extractProductPriceFromPage() {
    const priceInputElement = document.getElementById(AMZN_PRICE_INPUT_FIELD_ID)
    return priceInputElement ? (priceInputElement as HTMLInputElement).value : 0;
}
//TODO: Remove  unhelpful comments
//document.addEventListener('DOMContentLoaded', () => {
console.log("I'll try to add stuff to the page!")
// Add the extension's CTA button to the page
addAmazonPageCTA();
// Update the page DOM if a timer already exists for the current URL
updatePageDOMIfTimerExists(AMZN_BUY_BTNS_IDS, []);
// Add click event listener to the CTA button
addAmazonPageCTACallback();
// Apply reduced social influence by overlaying reviews if applicable
addReducedSocialInfluence();
//});