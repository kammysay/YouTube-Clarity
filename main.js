/**
 * Selectively converts video titles to an unflashy lowercase,
 * and replaces thumbnails with a bland, boring image that will
 * surely not catch your eye.
 */

// Get link to default image
let thumb_url = browser.runtime.getURL("images/default_thumbnail.jpg");

// Initial function calls
lowercase_titles();
remove_thumbnails();

// When mouse scrolled, call functions to keep up with newly loaded videos
window.addEventListener('wheel', function() {
    lowercase_titles();
    remove_thumbnails();
});

/**
 * Removes thumbnails from youtube videos
 */
function remove_thumbnails(){
    /**
     * The element that stores the thumbnail link has a class name of "style-scope yt-img-shadow".
     * Other images also use this classname, such as profile pictures, so we need to limit it
     * to only thumbnails. Two nodes above the img element is the thumbnail element with 
     * id=thumbnail.
     */
    var thumbnails = document.getElementsByClassName("style-scope yt-img-shadow");
    for(var i=0; i<thumbnails.length; i++){
        if(thumbnails[i].parentElement.parentElement.id === "thumbnail"){
            thumbnails[i].src = thumb_url;
        }
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