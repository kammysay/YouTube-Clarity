/** 
 * This script is used to listen for changes to the popup.html page. All information entered
 * will be saved to the user's local storage. Information gathered is for use by main.js
 * 
 * The "storage" permission is needed in manifest.json to remember what options the user selects.
 */

/**
 * Turns the extension on or off
 */
function toggle_on_off(){
    let toggle_res = browser.storage.local.get('state');
    toggle_res
        .then((res) => {
            // If extension is turned on, turn it off
            if(res.state == true){
                // Set to off, update the logo
                browser.storage.local.set({
                    state: false
                });
                display_button();
            }
            // Else, it is off, turn it on
            else{
                // Set to on, update the logo
                browser.storage.local.set({
                    state: true
                });
                display_button();
            }
        });
}

/**
 * Display the on/off button. For use by restore_options and toggle_on_off.
 */
function display_button(){
    // Set the image for the logo
    let toggle_res = browser.storage.local.get('state');
    toggle_res
        .then((res) => {
            // If extension is on
            if(res.state == true){
                document.getElementById("toggle-on").innerHTML = '<img src="logo_on.jpg" width="225px">';
            }
            // If extension is off
            else if(res.state == false){
                document.getElementById("toggle-on").innerHTML = '<img src="logo_off.jpg" width="225px">';
            }
            // Else, the "state" in storage is uninitialized. 
            else{
                // Turn the extension on
                browser.storage.local.set({
                    state: true
                });
                // Call this function again, it will display as "on"
                display_button();
            }
        });
}

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
    // Set the image for the logo
    display_button();

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
document.addEventListener("DOMContentLoaded", restore_options);                     // initial popup load
document.addEventListener("storage", restore_options);                              // changes to storage (new time set)
document.getElementById("toggle-on").addEventListener("click", toggle_on_off);      // user toggles on/off switch
document.getElementById("always-active").addEventListener("change", save_options);  // user toggles always active mode
document.querySelector("form").addEventListener("submit", save_options);            // user clicks save_time button