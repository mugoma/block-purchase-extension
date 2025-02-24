import { addNavbarEventListeners } from "./navbar";

addNavbarEventListeners()
/**
 * Saves the options for the timer and reviews settings to Chrome's local storage.
 * Updates the user interface to indicate that the options were successfully saved.
 */
const saveOptions = () => {
    // Retrieve the state of the 'timer' and 'reviews' checkboxes

    const timerElement = document.getElementById('timer') as HTMLInputElement;
    const timer = timerElement ? timerElement.checked : false;
    const timerDurationElement = document.getElementById('timer-duration') as HTMLInputElement;
    const timerDuration = timerDurationElement ? timerDurationElement.value : '';
    const reviewsElement = document.getElementById('reviews') as HTMLInputElement;
    const reviews = reviewsElement ? reviewsElement.checked : false;

    // Save the options to Chrome's local storage
    chrome.storage.local.set({ timer: timer, reviews: reviews, timerDuration: timerDuration }).then(
        () => {
            // Notify the user that the options were saved
            const status = document.getElementById('status');
            if (status) {
                status.textContent = 'Options saved.';

                // Clear the status message after 750 milliseconds
                setTimeout(() => {
                    status.textContent = '';
                }, 750);
            }
        }
    );
};
/**
 * Restores the saved options for the timer and reviews settings from Chrome's local storage.
 * Updates the checkbox states in the user interface based on the saved values.
 */
const restoreOptions = () => {
    // Get the stored options from Chrome's local storage (default to true if not set)
    chrome.storage.local.get({ timer: true, reviews: true, timerDuration: 24 }).then(
        (items) => {
            const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
            if (timerCheckbox) {
                timerCheckbox.checked = items.timer;
            }
            const reviewsCheckbox = document.getElementById('reviews') as HTMLInputElement;
            if (reviewsCheckbox) {
                reviewsCheckbox.checked = items.reviews;
            }
            const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;
            if (timerDurationInput) {
                timerDurationInput.value = items?.timerDuration;
                timerDurationInput.disabled = !items.timer;
            }
        }
    );
};
// Restore options when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', restoreOptions);
// Add a click event listener to the "Save" button to save options when clicked
const saveButton = document.getElementById('save');
if (saveButton) {
    saveButton.addEventListener('click', saveOptions);
}
// Disable timer select option when reflection is disabled.
const timerCheckbox = document.getElementById('timer') as HTMLInputElement;
if (timerCheckbox) {
    timerCheckbox.addEventListener('change', (event) => {
        const timerDurationInput = document.getElementById('timer-duration') as HTMLInputElement;
        if (timerDurationInput) {
            if (event.target) {
                timerDurationInput.disabled = !(event.target as HTMLInputElement).checked;
            }
        }
    });
}