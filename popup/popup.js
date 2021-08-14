/** 
 * This script is used to listen for changes to the popup.html page. All information entered
 * will be saved to the user's local storage. Information gathered is for use by main.js
 * 
 * The "storage" permission is needed in manifest.json to remember what options the user selects.
 */

/**
 * Save the time window that the user submitted to local storage
 */
function save_options(){
    // Save the always active mode selection
    browser.storage.local.set({
        alwaysActive: document.querySelector("#always-active").checked
    });

    // Save the timed selections
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
    // Display currently selected always active mode selection
    let always_res = browser.storage.local.get('alwaysActive');
    always_res
        .then((res) => {
            document.getElementById("always-active").checked = res.alwaysActive;
        });

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
document.addEventListener("DOMContentLoaded", restore_options);                             // initial popup load
document.addEventListener("storage", restore_options);                                      // changes to storage (new time set)
document.querySelector("form").addEventListener("submit", save_options);                    // user clicks save_time button
document.querySelector("input[id=always-active]").addEventListener("change", save_options); // user toggles always active mode