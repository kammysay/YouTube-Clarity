/**
 * Selectively converts video titles to an unflashy lowercase,
 * and replaces thumbnails with a bland, boring image that will
 * surely not catch your eye.
 */

/* URL to replacement thumbnail */
let tn_url = browser.runtime.getURL("images/default_thumbnail.jpg");

/**
 * Global list of all <a> id=thumbnail tags.
 * This will be updated throughout the runtime of this program, and reset
 * each time the DOM finishes loading. Also will be reset when page scrolled,
 * but previously accessed thumbnails will not be re-added.
 */
var tn_a_tags;

// Initial function calls
lowercase_titles();


// When mouse scrolled, call functions to keep up with newly loaded videos
window.addEventListener('wheel', function() {
    // Set video titles to lowercase
    lowercase_titles();

    // Remove thumbnails
    tn_a_tags = document.querySelectorAll('[id=thumbnail]');
    // tn_a_tags = document.getElementsByClassName("yt-simple-endpoint inline-block style-scope ytd-thumbnail");
    remove_tns();
});

/**
 * Optimized version of remove_thumbnails.
 * 
 * Currently works, and much faster than previous code.
 * However, it messes with thumbnail box sizing, due to the id changing, 
 * I suspect the issue lies in YouTube's css setting styles for 
 * #thumbnails. 
 */
function remove_tns(){
    // For each entry in tn_a_tags
    for(var i=0; i<tn_a_tags.length; i++){
        // Get the img tag, which stores the thumbnail
        var tn_img_tag = tn_a_tags[i].querySelector('[id=img]');

        // Set new img
        tn_img_tag.src = tn_url;

        // Modify id of tn_a_tag entry to mark as already swapped
        tn_a_tags[i].id = "thumbnail_modified";
        // tn_a_tags[i].class = "yt-simple-endpoint inline-block style-scope ytd-thumbnail modified";
    }

    /**
     * Remove modified tn_a_tags from list to keep page running smoothly.
     * If we do not do this, then we will always loop over thumbnails that
     * we have already removed, slowing the page down a whole heck of a lot
     */
    tn_a_tags = [];
}

/**
 * Get all elements tagged as thumbnails (they're <a> tags),
 * and then find where they store the image. Replace that image
 * source with ours. 
 * 
 * This function works, but it results in the web page running
 * VERY slowly, as we continuously loop over *every* thumbnail,
 * regardless of whether we have already modified it's img.
 */
function remove_thumbnails(){
    var thumbnail_a_tags = document.querySelectorAll('[id=thumbnail]');
    // For every thumbnail_a_tag, we need to set the img src to new image
    for(var i=0; i<thumbnail_a_tags.length; i++){
        var thumbnail_img = thumbnail_a_tags[i].querySelector('[id=img]');
        thumbnail_img.src = thumbnail_url;
    }
}

/**
 * Sets all video titles to lowercase
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