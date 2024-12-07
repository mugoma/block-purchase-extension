// Add a click event listener to the element with the ID stored in OPTIONS_PAGE_LINK_ID.
document.getElementById(OPTIONS_PAGE_LINK_ID)?.addEventListener("click", () => {
    openOptionsPage();
})
// Add a click event listener to the element with the ID stored in HOW_TO_USE_PAGE_LINK_ID.
document.getElementById(HOW_TO_USE_PAGE_LINK_ID)?.addEventListener("click", () => {
    window.open(chrome.runtime.getURL('../pages/how-to-use.html'));
})