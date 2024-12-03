document.getElementById(OPTIONS_PAGE_LINK_ID)?.addEventListener("click", () => {
    openOptionsPage();
})
document.getElementById(HOW_TO_USE_PAGE_LINK_ID)?.addEventListener("click", () => {
    window.open(chrome.runtime.getURL('../pages/how-to-use.html'));
})