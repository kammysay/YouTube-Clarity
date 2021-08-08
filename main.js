/**
 * Convert video titles to lowercase and replace video thumbnails
 * with a bland, boring image on YouTube.com.
 */

/* URL to replacement thumbnail */
/* Currently have it set to "" because it's faster than using an actual image */
// let tn_url = browser.runtime.getURL("images/default_thumbnail.jpg");
let tn_url = "";

/**
 * Global list of all <a> id=thumbnail tags, updated as the script runs.
 */
var tn_a_tags;

// Events that should trigger a run through of the functions
window.addEventListener('load', event_handler);     // When content finishes loading
window.addEventListener('wheel', event_handler);    // When page is scrolled, new videos could load

function event_handler(){
    // Video titles to lowercase
    // lowercase_titles();

    // Remove thumbnails
    tn_a_tags = document.querySelectorAll('[id=thumbnail]');
    remove_tns();
}

/**
 * Removes thumbnails from <a> thumbnail tags.
 */
function remove_tns(){
    // For each entry in tn_a_tags
    for(var i=0; i<tn_a_tags.length; i++){
        // Get the img tag, which stores the thumbnail
        var tn_img_tag = tn_a_tags[i].querySelector('[id=img]');

        /**
         * Set the new thumbnail image. Setting the link to "" runs very smooth.
         * However, using another image slows the page down a decent amount.
         * 
         * Only update the src if it has not already been updated.
         */
        if(tn_img_tag.src != tn_url){
            tn_img_tag.src = tn_url;
        }
    }
}

/**
 * Sets all video titles to lowercase.
 * Function not currently being used, as I am currently
 * handling this with css.
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