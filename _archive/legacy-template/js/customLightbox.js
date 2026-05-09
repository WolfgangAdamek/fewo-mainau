// Use jQuery.noConflict() to avoid conflicts with other libraries
var $j = jQuery.noConflict();

$j(document).ready(function() {
    // Initialize variables
    var images = $j('.gallery-content img'); // Get all images
    var currentIndex = 0; // Current image index
    var totalImages = images.length;

    // Function to update the lightbox with the selected image
    function updateLightbox(index) {
        var imageUrl = images.eq(index).attr('src');
        $j('.modal-body .gallery-content img').hide(); // Hide all images
        $j('.modal-body .gallery-content img').eq(index).show(); // Show the selected image
        $j('.modal-title').text('Image Gallery (' + (index + 1) + '/' + totalImages + ')');
    }

    // Function to handle the next button click
    $j('.next-button').on('click', function() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateLightbox(currentIndex);
    });

    // Function to handle the previous button click
    $j('.prev-button').on('click', function() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateLightbox(currentIndex);
    });

    // Function to handle the pagination links
    $j('.pagination-link').on('click', function() {
        currentIndex = $j(this).data('index');
        updateLightbox(currentIndex);
    });

    // Function to open the lightbox when an image is clicked
    images.on('click', function() {
        currentIndex = $j(this).index();
        updateLightbox(currentIndex);
        $j('#lightbox-gallery').modal('show');
    });

    // Initialize pagination links
    var pagination = $j('.modal-body .pagination');
    for (var i = 0; i < totalImages; i++) {
        var paginationItem = '<li><a class="pagination-link" data-index="' + i + '">' + (i + 1) + '</a></li>';
        pagination.append(paginationItem);
    }

    // Trigger a click on the first pagination link to show the first image
    $j('.pagination-link').eq(0).trigger('click');
});
