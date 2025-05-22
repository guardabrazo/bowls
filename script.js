document.addEventListener('DOMContentLoaded', function() {
    const videoGrid = document.querySelector('.video-grid-container');
    const numberOfVideos = 12;

    if (videoGrid) {
        for (let i = 1; i <= numberOfVideos; i++) {
            const videoElement = document.createElement('video');
            videoElement.src = `videos/video_${i}.mp4`; // Assumes video files are named video_1.mp4, video_2.mp4, etc.
            videoElement.muted = true; // Start muted to allow autoplay in most browsers
            videoElement.loop = true;
            videoElement.playsInline = true; // Important for iOS
            videoElement.setAttribute('autoplay', ''); // Autoplay attribute

            // Attempt to play the video - some browsers require user interaction
            // Muting helps with autoplay policies
            videoElement.play().catch(error => {
                console.log(`Video ${i} autoplay was prevented: `, error);
                // Optionally, add a play button or other UI to let user start videos
            });

            videoGrid.appendChild(videoElement);
        }
    }
});
