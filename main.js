/**
 * Convert video titles to lowercase and replace video thumbnails
 * with a bland, boring image on YouTube.com.
 */

/* URL to replacement thumbnail */
/* Currently have it set to "" because it's faster than using an actual image */
let tn_url = "";

/* Global list of all <a> id=thumbnail tags, updated as the script runs. */
var tn_a_tags;

/* Variables for determining whether or not to the extension will be run. */
var isExtensionActive = false;
var start_time = -1;
var end_time = -1;

/**
 * Update the time that the extension is supposed to run from the saved
 * time in storage.
 */
function update_time(){
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

    // If current time greater than start time and less than end time
    if(hour >= start_hour && hour < end_hour){
        // Still need to account for the minutes.
        isExtensionActive = true;
        console.log("Hiding");
    }else{
        isExtensionActive = false;
        console.log("Not Hiding");
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

function event_handler(){
    // This doesn't quite work yet.
    if(start_time == -1 || end_time == -1){
        update_time();
    }

    // Remove thumbnails if the extension is active
    if(isExtensionActive == true){
        tn_a_tags = document.querySelectorAll('[id=thumbnail]');
        remove_tns();
    }
}

// Events that should trigger a run through of the functions
window.addEventListener('DOMContentLoaded', update_time);
document.addEventListener("storage", update_time);  // changes to storage (new time set)
window.addEventListener('load', event_handler);     // When content finishes loading
window.addEventListener('wheel', event_handler);    // When page is scrolled, new videos could load

window.addEventListener('click', update_time);      // debug