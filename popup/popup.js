
const twentyFourHours = 24 * 60 * 60000

function add_url_to_storage(url, proposedTime) {
    chrome.storage.local.get(url).then((result) => {
        var storedTime = result[url]
        if (storedTime == undefined) {
            var urlTime = {};
            urlTime[url] = new Date(proposedTime).toString()
            return chrome.storage.local.set(urlTime).then(
                () => {
                    return proposedTime
                });
        };
        return storedTime
    }).then((timeForCountdown) => {
        document.getElementById('add-timer-btn').remove()
        document.getElementById('popup-text').innerHTML = "Added to timer!";

 



        const countdownElementId = "countdown-timer";
        createCountdownTimer(new Date(timeForCountdown), countdownElementId);

        const resetTimerBtnId = "reset-timer-btn";
        var resetTimerBtnElem = document.getElementById(resetTimerBtnId);
        resetTimerBtnElem.classList.remove('btn-hidden');
        resetTimerBtnElem.classList.add('btn-visible');

    }).catch((error) => {
        console.error('Failed to add URL to storage or create countdown:', error);
    });
}


function createCountdownTimer(targetDate, elementId) {
    // Get the target date and time in milliseconds
    const targetTime = new Date(targetDate).getTime();

    // Get the current time in milliseconds
    const now = Date.now();

    // Calculate the difference in milliseconds
    var difference = targetTime - now;

    // Check if the countdown has already ended
    if (difference <= 0) {
        document.getElementById(elementId).innerHTML = "Time's up!";
        return;
    }

    const timerPreText = "Time left: "
    // Define an update function to be called every second
    const updateTimer = () => {
        // Calculate the remaining time in seconds
        const remainingSeconds = Math.floor(difference / 1000);

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = Math.floor(remainingSeconds % 60);

        // Format the remaining time string with leading zeros for hours and minutes
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        // Update the element with the formatted time

        document.getElementById(elementId).innerHTML = timerPreText + formattedTime;

        // Decrement the difference by 1 second
        difference -= 1000;

        // Check if the countdown has ended
        if (difference <= 0) {
            clearInterval(intervalId);
            document.getElementById(elementId).innerHTML = "Time's up!";
        }
    };

    // Start the countdown timer with an interval of 1 second
    const intervalId = setInterval(updateTimer, 1000);
}


document.querySelector('#add-timer-btn').addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0) {
            const url = tabs[0].url;
            let currentTime = new Date(Date.now() + twentyFourHours);
            add_url_to_storage(url, currentTime)
            console.log(url);
        } else {
            console.error("Failed to get the current tab's URL.");
        }
    });
})