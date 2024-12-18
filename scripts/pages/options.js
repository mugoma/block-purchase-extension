/**
 * Saves the options for the timer and reviews settings to Chrome's local storage.
 * Updates the user interface to indicate that the options were successfully saved.
 */
const saveOptions = () => {
    // Retrieve the state of the 'timer' and 'reviews' checkboxes

    const timer = document.getElementById('timer').checked;
    const timerDuration = document.getElementById('timer-duration').value;
    const reviews = document.getElementById('reviews').checked;

    // Save the options to Chrome's local storage
    chrome.storage.local.set({ timer: timer, reviews: reviews, timerDuration: timerDuration }).then(
        () => {
            // Notify the user that the options were saved
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            // Clear the status message after 750 milliseconds
            setTimeout(() => {
                status.textContent = '';
            }, 750);
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
            document.getElementById('timer').checked = items.timer;
            document.getElementById('reviews').checked = items.reviews;
            document.getElementById('timer-duration').value = items?.timerDuration;
            document.getElementById('timer-duration').disabled = !items.timer;
        }
    );
};
function handleTimerChange(event) {

}
// Restore options when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', restoreOptions);
// Add a click event listener to the "Save" button to save options when clicked
document.getElementById('save').addEventListener('click', saveOptions);
// Disable timer select option when reflection is disabled.
document.getElementById('timer').addEventListener('change', (event) => {
    document.getElementById('timer-duration').disabled = !event.target.checked;
})