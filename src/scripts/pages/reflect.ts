import { SOURCE_URL_PARAM } from "../constants";
import { addNavbarEventListeners } from "./navbar";
const REFLECTION_REASON_WHY_INPUT_PREFIX = "reflection_reason_why_";
const REFLECTION_REASON_WHY_NOT_INPUT_PREFIX = "reflection_reason_why_not_";
addNavbarEventListeners()

export function getReflectionStorageKey(url: string | null) {
    return url != null ? "reflection_" + String(url) : null;
}
function getSourceOfRedirection() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(SOURCE_URL_PARAM);
}
type ReflectionResponses = {
    [key: string]: string
}
type ReflectionStorageObject = {
    [key: string]: ReflectionResponses
}
/**
 * Saves the options for the timer and reviews settings to Chrome's local storage.
 * Updates the user interface to indicate that the options were successfully saved.
 */
export const saveOptions = () => {
    // Retrieve the state of the 'timer' and 'reviews' checkboxes

    const formElement = document.getElementById("reflection_form") as HTMLFormElement
    if (formElement.reportValidity()) {
        let user_responses: ReflectionResponses = {};

        for (let index = 1; index < 4; index++) {
            const reason_why_input_name = REFLECTION_REASON_WHY_INPUT_PREFIX + String(index)
            const reason_why_not_input_name = REFLECTION_REASON_WHY_NOT_INPUT_PREFIX + String(index)

            const reasonWhyElement = document.getElementById(reason_why_input_name) as HTMLInputElement;
            const reasonWhyNotElement = document.getElementById(reason_why_not_input_name) as HTMLInputElement;
            user_responses[reason_why_input_name] = reasonWhyElement.value
            user_responses[reason_why_not_input_name] = reasonWhyNotElement.value

        }
        const storageKey = getReflectionStorageKey(getSourceOfRedirection());
        const storageObject: ReflectionStorageObject = { storageKey: user_responses }
        if (storageKey) {
            storageObject[storageKey] = user_responses;

            // Save the options to Chrome's local storage
            chrome.storage.local.set(storageObject).then(
                () => {
                    // Notify the user that the options were saved
                    const status = document.getElementById('status');
                    if (status) {
                        status.textContent = 'Responses saved. Redirecting you back to the shopping page';

                        // Clear the status message after 750 milliseconds
                        setTimeout(() => {
                            status.textContent = '';
                            const redirectionURL = getSourceOfRedirection();
                            if (redirectionURL) {
                                window.location.href = redirectionURL
                            }
                        }, 2000);
                    }
                }
            );
        }
    }
};
/**
 * Restores the saved options for the timer and reviews settings from Chrome's local storage.
 * Updates the checkbox states in the user interface based on the saved values.
 */
export const restoreOptions = () => {
    const storageKey = getReflectionStorageKey(getSourceOfRedirection())
    // Get the stored options from Chrome's local storage (default to true if not set)
    chrome.storage.local.get(storageKey).then(
        (items) => {
            if (storageKey) {
                const user_responses: ReflectionResponses = items[storageKey]
                if (user_responses) {
                    for (let index = 1; index < 4; index++) {
                        const reason_why_input_name = REFLECTION_REASON_WHY_INPUT_PREFIX + String(index)
                        const reason_why_not_input_name = REFLECTION_REASON_WHY_NOT_INPUT_PREFIX + String(index)

                        const reasonWhyElement = document.getElementById(reason_why_input_name) as HTMLInputElement;
                        const reasonWhyNotElement = document.getElementById(reason_why_not_input_name) as HTMLInputElement;
                        reasonWhyElement.value = user_responses[reason_why_input_name]
                        reasonWhyNotElement.value = user_responses[reason_why_not_input_name]

                    }
                }
            }
        }
    );
};
const resetOptions = () => {
    const storageKey = getReflectionStorageKey(getSourceOfRedirection())
    if (storageKey) {
        chrome.storage.local.remove(storageKey).then(() => {
            for (let index = 1; index < 4; index++) {
                const reason_why_input_name = REFLECTION_REASON_WHY_INPUT_PREFIX + String(index)
                const reason_why_not_input_name = REFLECTION_REASON_WHY_NOT_INPUT_PREFIX + String(index)

                const reasonWhyElement = document.getElementById(reason_why_input_name) as HTMLInputElement;
                const reasonWhyNotElement = document.getElementById(reason_why_not_input_name) as HTMLInputElement;
                reasonWhyElement.value = ''
                reasonWhyNotElement.value = ''

            }
        })
    }
}
// Restore options when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', restoreOptions);
// Add a click event listener to the "Save" button to save options when clicked
const saveButton = document.getElementById('save');
if (saveButton) {
    saveButton.addEventListener('click', saveOptions);
}

const resetButton = document.getElementById('reset');
if (resetButton) {
    resetButton.addEventListener('click', resetOptions);
}
const returnButton = document.getElementById('go_to_shopping_site');
if (returnButton) {
    returnButton.addEventListener('click', () => {
        const redirectionURL = getSourceOfRedirection();
        if (redirectionURL) {
            window.location.href = redirectionURL
        }
    });
}
