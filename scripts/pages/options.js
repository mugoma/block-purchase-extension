const saveOptions = () => {
    const timer = document.getElementById('timer').checked;
    const reviews = document.getElementById('reviews').checked;

    chrome.storage.local.set({ timer: timer, reviews: reviews }).then(
        () => {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

const restoreOptions = () => {
    chrome.storage.local.get({ timer: true, reviews: true }).then(
        (items) => {
            document.getElementById('timer').checked = items.timer;
            document.getElementById('reviews').checked = items.reviews;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);