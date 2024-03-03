

function add_url_to_storage(url, current_time) {
    chrome.storage.local.get(url).then((value) => {
        if (!value) {
            chrome.storage.local.set({ url: current_time }).then(() => { console.log("added to the best o my ability") });

        };
        document.querySelector('#add-timer-btn').remove()
        document.querySelector('#popup-text').innerHTML="Added to timer!"

    })
}

function countdown(time){
    //TODO: Add countdown
}
document.querySelector('#add-timer-btn').addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0) {
          const url = tabs[0].url;
          // Do something with the URL, like displaying it or sending it elsewhere
          add_url_to_storage(url)
          console.log(url);
        } else {
          console.error("Failed to get the current tab's URL.");
        }
      });
})