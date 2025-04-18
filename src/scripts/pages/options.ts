import { REFLECTION_STORAGE_KEY } from "../constants";
import { addNavbarEventListeners } from "./navbar";
addNavbarEventListeners()
type UserOptions = {
    timer: boolean,
    reviews: boolean,
    timerDuration: string | number,
    reflection: boolean
}
/**
 * Saves the options for the timer and reviews settings to Chrome's local storage.
 * Updates the user interface to indicate that the options were successfully saved.
 */
export const saveOptions = () => {
    // Retrieve the state of the 'timer' and 'reviews' checkboxes

    const timerElement = document.getElementById('timer') as HTMLInputElement;
    const timer = timerElement ? timerElement.checked : false;
    const timerDurationElement = document.getElementById('timer-duration') as HTMLInputElement;
    const timerDuration = timerDurationElement ? timerDurationElement.value : '';
    const reviewsElement = document.getElementById('reviews') as HTMLInputElement;
    const reviews = reviewsElement ? reviewsElement.checked : false;
    const reflectionElement = document.getElementById('reflection') as HTMLInputElement;
    const reflection = reflectionElement ? reflectionElement.checked : false;
    // Save the options to Chrome's local storage
    const options: UserOptions = { timer: timer, reviews: reviews, timerDuration: timerDuration, reflection: reflection }
    chrome.storage.local.set(options).then(
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
export const restoreOptions = () => {
    // Get the stored options from Chrome's local storage (default to true if not set)
    const defaultOptions: UserOptions = { timer: true, reviews: true, timerDuration: 24, reflection: true }
    chrome.storage.local.get(defaultOptions).then(
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
            const reflectionCheckbox = document.getElementById('reflection') as HTMLInputElement;
            if (reflectionCheckbox) {
                console.log(items[REFLECTION_STORAGE_KEY])
                reflectionCheckbox.checked = items[REFLECTION_STORAGE_KEY]
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