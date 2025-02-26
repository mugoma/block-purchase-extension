import { OPTIONS_PAGE_LINK_ID, openOptionsPage, openPage, STATS_PAGE_NAME, HOW_TO_USE_PAGE_LINK_ID, STATS_PAGE_LINK_ID, HOW_TO_USE_PAGE_NAME } from "../utils";

export function addNavbarEventListeners() {

    // Add a click event listener to the element with the ID stored in OPTIONS_PAGE_LINK_ID.
    document.getElementById(OPTIONS_PAGE_LINK_ID)?.addEventListener("click", () => {
        openOptionsPage();
    })
    // Add a click event listener to the element with the ID stored in HOW_TO_USE_PAGE_LINK_ID.
    document.getElementById(HOW_TO_USE_PAGE_LINK_ID)?.addEventListener("click", () => {
        openPage(HOW_TO_USE_PAGE_NAME)
    })
    // Add a click event listener to the element with the ID stored in STATS_PAGE_LINK_ID.
    document.getElementById(STATS_PAGE_LINK_ID)?.addEventListener("click", () => {
        openPage(STATS_PAGE_NAME)
    })

}