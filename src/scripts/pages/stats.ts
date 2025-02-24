import { getStoredPurchases, StoredInfo } from "../utils";
import { addNavbarEventListeners } from "./navbar";

// IDs for elements where the purchase lists will be displayed
const DEFERRED_PURCHASES_LIST_ID = "deferred-purchases-list";
const COMPLETED_PURCHASES_LIST_ID = "completed-purchases-list";
// IDs for the elements where the general statistics will be displayed
const COMPLETED_PURCHASES_COUNT_ID = "completed-purchases-count";
const DEFERRED_PURCHASES_COUNT_ID = "deferred-purchases-count";
const AMOUNT_SAVED_ID = "amount-saved";
// Basic Button Styling 
const BASIC_BUTTON_STYLING = [
    "btn", "background-brown", "text-white"
]
// Items per page
const ITEMS_PER_PAGE = 5;

// State for pagination
let deferredPurchases: string[] = [];
let completedPurchases: string[] = [];
let deferredPage = 1;
let completedPage = 1;



/**
 * Format a datetime into human-friendly form.
 * @param {string} dateTime A datetime in string form
 * @returns {string}
 */
function formatStoredTime(dateTime: string | number | Date) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return formatter.format(new Date(dateTime));
}

/**
 * Renders a paginated list of purchases in the specified container.
 *
 * @param {string[]} purchases - Array of purchase URLs to display.
 * @param {string} containerId - The ID of the DOM element where the list will be displayed.
 * @param {number} currentPage - The current page number.
 */
function renderPaginatedList(purchases: any[], containerId: string, currentPage: number) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = "";

    // Calculate start and end indices for pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems: Array<StoredInfo> = purchases.slice(startIndex, endIndex);

    if (paginatedItems.length === 0) {
        container.innerHTML = "<li>No purchases found.</li>";
        return;
    }

    // Create list items for each purchase URL
    paginatedItems.forEach((storedInfo: StoredInfo, index: number, array: StoredInfo[]) => {
        const listItem = document.createElement("li");
        const url = storedInfo?.url ? storedInfo.url : storedInfo
        const timerEndTime = storedInfo?.timerEndTime ? ` | ${formatStoredTime(storedInfo.timerEndTime)} | ` : ''
        const price = storedInfo?.price ? `<span class="text-brown">$${storedInfo.price}</span>` : '';
        listItem.innerHTML = `${startIndex + index + 1}. ${price}${timerEndTime}${url}`;
        container.appendChild(listItem);
    });

    // Render pagination controls
    renderPaginationControls(container, purchases, currentPage, containerId);
}

/**
 * Renders pagination controls for navigating through pages, including page numbering.
 *
 * @param {HTMLElement} container - The container element to append controls to.
 * @param {string[]} purchases - The full list of purchases.
 * @param {number} currentPage - The current page number.
 * @param {string} containerId - The ID of the container for context.
 */
function renderPaginationControls(container: HTMLElement, purchases: string | any[], currentPage: number, containerId: string) {
    const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE);

    // Create pagination controls container
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination-controls");

    // Previous button
    const prevButton = document.createElement("button");
    prevButton.classList.add(...BASIC_BUTTON_STYLING)
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (containerId === DEFERRED_PURCHASES_LIST_ID) {
            deferredPage--;
            renderPaginatedList(deferredPurchases, DEFERRED_PURCHASES_LIST_ID, deferredPage);
        } else {
            completedPage--;
            renderPaginatedList(completedPurchases, COMPLETED_PURCHASES_LIST_ID, completedPage);
        }
    });

    // Page number display
    const pageNumber = document.createElement("span");
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
    pageNumber.classList.add("page-number");

    // Next button
    const nextButton = document.createElement("button");
    nextButton.classList.add(...BASIC_BUTTON_STYLING)
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (containerId === DEFERRED_PURCHASES_LIST_ID) {
            deferredPage++;
            renderPaginatedList(deferredPurchases, DEFERRED_PURCHASES_LIST_ID, deferredPage);
        } else {
            completedPage++;
            renderPaginatedList(completedPurchases, COMPLETED_PURCHASES_LIST_ID, completedPage);
        }
    });

    // Append buttons and page number to the pagination controls
    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageNumber);
    paginationDiv.appendChild(nextButton);

    // Append the pagination controls to the container
    if (totalPages !== 1) {
        container.appendChild(paginationDiv);
    }
}

/**
 * Renders the total amount saved.
 * 
 * @param {Object[]} deferredPurchases - Array of purchase objects with amount properties.
 * @param {string} containerId - The ID of the container where the total saved amount will be rendered.
 */
function renderAmountSaved(deferredPurchases: any[], containerId: string) {
    const totalSaved = deferredPurchases.reduce((prev: number, cur: { price: string; }) => {
        if (cur.price) {
            return (parseFloat(cur.price) * 100 + prev * 100) / 100;
        }
        return prev;
    }, 0); // Initialize prev to 0

    const container = document.getElementById(containerId);
    if (container) {
        container.textContent = `Total Saved: $${totalSaved.toFixed(2)}`;
    } else {
        console.error(`Container with ID "${containerId}" not found.`);
    }
}


/**
 * Renders the total count of product categories in a specified container.
 * 
 * @param {string[]} purchases The full list of purchases
 * @param {string} containerId The ID for the element which will display 
 *      the information
 */
function renderProductCategoryCount(purchases: string[], containerId: string) {
    const containerElement = document.getElementById(containerId);

    if (containerElement !== null) {
        containerElement.textContent = purchases.length.toString();
    } else {
        console.error(`Element with ID '${containerId}' not found.`);
    }
}
// Event listener to run once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    addNavbarEventListeners()
    getStoredPurchases().then(({ deferred, completed }) => {
        // Store the retrieved purchases in global variables
        deferredPurchases = deferred;
        completedPurchases = completed;

        // Render the deferred and completed purchases with pagination
        renderPaginatedList(deferredPurchases, DEFERRED_PURCHASES_LIST_ID, deferredPage);
        renderPaginatedList(completedPurchases, COMPLETED_PURCHASES_LIST_ID, completedPage);
        // Add general statistics
        renderProductCategoryCount(deferredPurchases, DEFERRED_PURCHASES_COUNT_ID);
        renderProductCategoryCount(completedPurchases, COMPLETED_PURCHASES_COUNT_ID);
        renderAmountSaved(deferredPurchases, AMOUNT_SAVED_ID)

    });
});

