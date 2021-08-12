/** 
 * This script will be used to send information to and from popup.html, for use by main.js
 * 
 * The "storage" permission is needed in manifest.json to remember what time window the user selects
 */

/**
 * Save the time window that the user submitted to local storage
 */
function save_options(){
    // Save these options to storage
    browser.storage.local.set({
        start: document.querySelector("#start-time").value
    });
    browser.storage.local.set({
        end: document.querySelector("#end-time").value
    });
}

/**
 * Set the value of the time input boxes to the user's saved time window
 */
function restore_options(){
    // Display currently saved start time
    let start_res = browser.storage.local.get('start');
    start_res
        .then((res) => {
            document.getElementById("start-time").value = res.start;
        });

    // Display currently saved end time
    let end_res = browser.storage.local.get('end');
    end_res
        .then((res) => {
            document.getElementById("end-time").value = res.end;
        });
}

// All events that could result in the need to call any functions
document.addEventListener("DOMContentLoaded", restore_options);             // initial popup load
document.addEventListener("storage", restore_options);                      // changes to storage (new time set)
document.querySelector("form").addEventListener("submit", save_options);    // user clicks save_time button