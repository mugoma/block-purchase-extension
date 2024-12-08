// IDs for elements where the purchase lists will be displayed
const DEFERRED_PURCHASES_LIST_ID = "deferred-purchases-list";
const COMPLETED_PURCHASES_LIST_ID = "completed-purchases-list";

// Basic Button Styling 
const BASIC_BUTTON_STYLING = [
    "btn", "background-brown", "text-white"
]
// Items per page
const ITEMS_PER_PAGE = 5;

// State for pagination
let deferredPurchases = [];
let completedPurchases = [];
let deferredPage = 1;
let completedPage = 1;


/**
 * Renders a paginated list of purchases in the specified container.
 *
 * @param {string[]} purchases - Array of purchase URLs to display.
 * @param {string} containerId - The ID of the DOM element where the list will be displayed.
 * @param {number} currentPage - The current page number.
 */
function renderPaginatedList(purchases, containerId, currentPage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = "";

    // Calculate start and end indices for pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = purchases.slice(startIndex, endIndex);

    if (paginatedItems.length === 0) {
        container.innerHTML = "<li>No purchases found.</li>";
        return;
    }

    // Create list items for each purchase URL
    paginatedItems.forEach((storedInfo, index) => {
        const listItem = document.createElement("li");
        const url = storedInfo?.url ? storedInfo.url : storedInfo
        const timerEndTime = storedInfo?.timerEndTime ? ` | ${storedInfo.timerEndTime}` : ''
        listItem.textContent = `${startIndex + index + 1}. ${url}${timerEndTime}`;
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
function renderPaginationControls(container, purchases, currentPage, containerId) {
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

// Event listener to run once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    getStoredPurchases().then(({ deferred, completed }) => {
        // Store the retrieved purchases in global variables
        deferredPurchases = deferred;
        completedPurchases = completed;

        // Render the deferred and completed purchases with pagination
        renderPaginatedList(deferredPurchases, DEFERRED_PURCHASES_LIST_ID, deferredPage);
        renderPaginatedList(completedPurchases, COMPLETED_PURCHASES_LIST_ID, completedPage);
    });
});
