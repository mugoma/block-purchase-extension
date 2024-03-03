

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
    var url = window.location.toString()
    add_url_to_storage(url)
})