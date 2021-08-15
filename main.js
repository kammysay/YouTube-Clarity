/**
 * Convert video titles to lowercase and replace video thumbnails
 * with a bland, boring image on YouTube.com.
 */

/* URL to replacement thumbnail. Set to "" because it's faster than using an actual image. */
let tn_url = "";

/* Global list of all <a> id=thumbnail tags, updated as the script runs. */
var tn_a_tags;

/* Variables for determining whether or not to the extension will be run. */
var isExtensionOn = false;
var isExtensionActive = false;
var always_active = false;
var start_time = -1;
var end_time = -1;

/**
 * Determine if extension is turned on or off.
 */
function is_turned_on(){
    let toggle_res = browser.storage.local.get('state');
    toggle_res
        .then((res) => {
            if(res.state == true) isExtensionOn = true;
            else isExtensionOn = false;
        });
}

/**
 * Determine if the user has selected the "always active" feature.
 */
function is_always_active(){
    // Check storage
    let always_res = browser.storage.local.get('alwaysActive');
    always_res
        .then((res) => {
            if(res.alwaysActive == true){
                always_active =  true;
            }
            else{
                always_active = false;
            }
        });

    return always_active;
}

/**
 * Fetch the user's selected period of time that they would like the extension
 * to run from storage and see if the current time is within that range.
 */
function is_within_time(){
    // Get the starting time
    let start_res = browser.storage.local.get('start');
    start_res
        .then((res) => {
            start_time = res.start;
        });

    // Get the ending time
    let end_res = browser.storage.local.get('end');
    end_res
        .then((res) => {
            end_time = res.end;
        });

    // Parsing the saved times into more usable information
    let start_arr = start_time.split(":");
    let end_arr = end_time.split(":");

    var start_hour = parseInt(start_arr[0]);
    var end_hour = parseInt(end_arr[0]);
    
    // Retrieving the current time
    var date = new Date();
    var hour = parseInt(date.getHours());
    var minute = parseInt(date.getMinutes());

    // If we are within the selected time, return true
    if(hour >= start_hour && hour < end_hour){
        return true;
    // Else, return false
    }else{
        return false;
    }

    /* Still need to add logic in for if start time is greater than end time. E.g. from 6pm to 1am */
}

/**
 * Removes thumbnails from <a> thumbnail tags.
 */
function remove_tns(){
    // For each entry in tn_a_tags
    for(var i=0; i<tn_a_tags.length; i++){
        // Get the img tag, which stores the thumbnail
        var tn_img_tag = tn_a_tags[i].querySelector('[id=img]');

        // Only update the src if it has not already been updated.
        if(tn_img_tag.src != tn_url){
            tn_img_tag.src = tn_url;
        }
    }
}

/**
 * Sets all video titles to lowercase.
 * Function not currently being used, this is currently
 * being handled with CSS.
 */
function lowercase_titles(){
    // querySelectorAll must be used in this case
    var titles = document.querySelectorAll('[id=video-title]');
    /**
     * This could potentially slow down as more and more videos
     * load, as this continously loops over all title entries.
     */
    for(var i=0; i<titles.length; i++){
        titles[i].textContent = titles[i].textContent.toLowerCase();
    }
}

/**
 * Function that runs every time certain event listeners are woken up
 */
function event_handler(){
    // Check whether extension is on or off
    is_turned_on();

    // If extension is turned off, don't check anything else
    if(isExtensionOn == false) return;

    // Determine whether or not the extension is currently active
    if(is_always_active() == true || is_within_time() == true){
        isExtensionActive = true;
    }
    else{
        isExtensionActive = false;
    }

    // If the extension is active, then do extension stuff
    if(isExtensionActive == true){
        tn_a_tags = document.querySelectorAll('[id=thumbnail]');
        remove_tns();
    }
}

// Events that should trigger a run through of the functions
window.addEventListener('DOMContentLoaded', event_handler);   // DOM loads
document.addEventListener("storage", event_handler);          // changes to storage (new time set)
window.addEventListener('load', event_handler);               // When content finishes loading
window.addEventListener('wheel', event_handler);              // When page is scrolled, new videos could load