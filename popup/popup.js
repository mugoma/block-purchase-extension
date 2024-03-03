document.addEventListener('DOMContentLoaded', function () {
    var elem = document.querySelector('#add-timer-btn');
    elem.addEventListener("click", () => {
        var url = window.location.toString()
        add_url_to_storage(url)
    })

})
function add_url_to_storage(url, current_time) {
    chrome.storage.local.get(url).then((value) => {
        if (value == null) {
            chrome.storage.local.set({url: current_time}).then(()=>{console.log("added to the best o my ability")});
            
        };
    })
    // const time_added = chrome.storage.local.getItem(url);
    // var response = "Object already in countdown";
    // if (time_added == null) {
    //     window.localStorage.setItem(url, current_time);
    //     response = "Object added to countdown"
    // };
    // console.log("added time")

}

