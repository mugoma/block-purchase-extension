import { openOptionsPage, openPage, OPTIONS_PAGE_LINK_CLASS, OPTIONS_PAGE_LINK_ID, STATS_PAGE_LINK_CLASS, STATS_PAGE_NAME } from "../utils";
import { addNavbarEventListeners } from "./navbar";

// Add a click event listener to the element with the ID stored in OPTIONS_PAGE_LINK_ID.
document.getElementById(OPTIONS_PAGE_LINK_ID)?.addEventListener("click", () => {
    openOptionsPage();
})
/**
 * Adds a click event listener to the "Statistics Page" link.
 * When clicked, it opens the user statistics page.
 */
Array.from(document.getElementsByClassName(STATS_PAGE_LINK_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        openPage(STATS_PAGE_NAME)
    })
})

/**
 * Adds a click event listener to the "Options Page" link.
 * When clicked, it opens the extension's options page.
 */
Array.from(document.getElementsByClassName(OPTIONS_PAGE_LINK_CLASS)).forEach(element => {
    element.addEventListener("click", () => {
        openOptionsPage()
    })
})
addNavbarEventListeners()