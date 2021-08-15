/**
 * Convert video titles to lowercase and replace video thumbnails
 * with a bland, boring image on YouTube.com.
 */

/* URL to replacement thumbnail. Set to "" because it's faster than using an actual image. */
let TN_URL = "";

/* Global list of all <a> id=thumbnail tags, updated as the script runs. */
var tn_a_tags;

/**
 * Variables for determining whether or not to the extension will be run.
 * Variables set to -1 indicate that they are not yet set.
 */
var isExtensionOn = true;
var isExtensionActive = false;
var always_active = -1;
var start_time = -1;
var end_time = -1;
var interval_needed = true;

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
 * 
 * This appears to be a fairly hefty function to run frequently in a content 
 * script, but I have not noticed any significant slow down as a result of it.
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
    var start_min = parseInt(start_arr[1]);
    var end_hour = parseInt(end_arr[0]);
    var end_min = parseInt(end_arr[1]);
    
    // Retrieving the current time
    var date = new Date();
    var hour = parseInt(date.getHours());
    var min = parseInt(date.getMinutes());
    
    // Edge Case: start_time is greater than end_time. (E.g. active from 6pm to 1am)
    if(start_hour > end_hour){
        // Here, it is easier to check if we are out of the selected time, so it's 
        // essentially just inverting the regular condition
        if(hour >= end_hour && hour <= start_hour){
            // If current hour equals start_hour or end_hour, we need to check minutes
            if(hour == end_hour){
                if(min >= end_min)
                    return false;
            }
            else if(hour == start_hour){
                if(min < start_min)
                    return false;
            }

            // Else, we are not within the selected time
            else if(hour >= end_hour && hour < start_hour)
                return false;
        }
        else
            return true;
    }

    // Edge Case: start_time is equal to end_time. (E.g. active from 6:00pm to 6:30pm)
    if(start_hour == end_hour){
        // Determine if we are within the selected minutes
        if(minute >= start_min && minute < end_minute)
            return true;
        else
            return false;
    }

    // Regular: start_hour is less than end_hour
    if(hour >= start_hour && hour <= end_hour){
        // If current hour equals start_hour or end_hour, we need to check the minute
        if(hour == start_hour){
            if(min >= start_min)
                return true;
        }
        else if(hour == end_hour){
            if(min < end_min)
                return true;
        }

        else if(hour > start_hour && hour < end_hour)
            return true;
        
    }else{
        return false;
    }
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
        if(tn_img_tag.src != TN_URL){
            tn_img_tag.src = TN_URL;
        }
    }
}

/**
 * Sets all video titles to lowercase.
 * Function not currently being used, this is currently being handled with CSS.
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
function event_handler(interval){
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

    // Check if we need to stop the initial interval
    if(interval_needed == true)
        stopLoadInterval();
}

// This interval runs at the initial load of the page, until it clears the first set of thumbnails
var interval = setInterval(event_handler, 1000)
function stopLoadInterval(){
    if(always_active != -1){
        clearInterval(interval);
        interval_needed = false;
    }
}

// Events that should trigger a run through of the functions
window.addEventListener('DOMContentLoaded', event_handler);   // DOM loads
document.addEventListener("storage", event_handler);          // changes to storage (new time set)
window.addEventListener('wheel', event_handler);              // When page is scrolled, new videos could load