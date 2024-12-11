/**
 * Adds a click event listener to the "Options Page" link.
 * When clicked, it opens the extension's options page.
 */
Array.from(document.getElementsByClassName(OPTIONS_PAGE_LINK_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        openOptionsPage();
    })
})
/**
 * Adds a click event listener to the "HOW_TO_USE_PAGE_LINK_CLASS" links.
 * When clicked, it opens the 'how to use' page.
 */
Array.from(document.getElementsByClassName(HOW_TO_USE_PAGE_LINK_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        openPage(HOW_TO_USE_PAGE_NAME)
    })
})