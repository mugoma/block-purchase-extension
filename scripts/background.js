// background.js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/content.js']
  });
});
// const ebay_site = 'https://ebay.com/itm/'

// chrome.action.onClicked.addListener(async (tab) => {
//     if (tab.url.startsWith(extensions)) {
//         console.log("User started the timer. ")
//         // // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//         // const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//         // // Next state will always be the opposite
//         // const nextState = prevState === 'ON' ? 'OFF' : 'ON'

//         // // Set the action badge to the next state
//         // await chrome.action.setBadgeText({
//         //     tabId: tab.id,
//         //     text: nextState,
//         // });
//     }
//     else {
//         console.log(tab.url)
//         console.log("What us happening")
//     }
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['scripts/content.js']
//     });
// });