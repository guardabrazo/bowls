document.addEventListener('DOMContentLoaded', function() {
    const videoGrid = document.querySelector('.video-grid-container');

    // IMPORTANT: Replace these placeholder URLs with your actual 12 Cloudinary video URLs
    const videoUrls = [
        "YOUR_VIDEO_URL_1", // Replace with your Cloudinary URL for video 1
        "YOUR_VIDEO_URL_2", // Replace with your Cloudinary URL for video 2
        "YOUR_VIDEO_URL_3", // etc.
        "YOUR_VIDEO_URL_4",
        "YOUR_VIDEO_URL_5",
        "YOUR_VIDEO_URL_6",
        "YOUR_VIDEO_URL_7",
        "YOUR_VIDEO_URL_8",
        "YOUR_VIDEO_URL_9",
        "YOUR_VIDEO_URL_10",
        "YOUR_VIDEO_URL_11",
        "YOUR_VIDEO_URL_12"
    ];

    if (videoGrid) {
        videoUrls.forEach((url, index) => {
            // A basic check to see if the URL is still a placeholder
            const isPlaceholder = url.startsWith("YOUR_VIDEO_URL_");

            if (url && !isPlaceholder) {
                const videoElement = document.createElement('video');
                videoElement.src = url;
                videoElement.muted = true; // Start muted to allow autoplay in most browsers
                videoElement.loop = true;
                videoElement.playsInline = true; // Important for iOS
                videoElement.setAttribute('autoplay', ''); // Autoplay attribute

                // Attempt to play the video
                videoElement.play().catch(error => {
                    console.log(`Video ${index + 1} (${url}) autoplay was prevented: `, error);
                    // Optionally, add a play button or other UI
                });
                videoGrid.appendChild(videoElement);
            } else {
                console.warn(`Placeholder URL found for video ${index + 1}. Please upload to Cloudinary and update script.js with the correct URL.`);
                // Optionally, display a placeholder in the grid
                const placeholderDiv = document.createElement('div');
                placeholderDiv.className = 'video-placeholder'; // You can style this class in style.css
                placeholderDiv.style.display = 'flex';
                placeholderDiv.style.alignItems = 'center';
                placeholderDiv.style.justifyContent = 'center';
                placeholderDiv.style.border = '1px dashed #555';
                placeholderDiv.style.backgroundColor = '#222';
                placeholderDiv.textContent = `Video ${index + 1} URL missing`;
                videoGrid.appendChild(placeholderDiv);
            }
        });
    }
});
