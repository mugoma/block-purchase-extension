const saveOptions = () => {
    const timer = document.getElementById('timer').checked;

    chrome.storage.local.set({ timer: timer }).then(
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
    chrome.storage.local.get({ timer: true }).then(
        (items) => {
            document.getElementById('timer').checked = items.timer;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);