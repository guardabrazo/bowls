document.addEventListener('DOMContentLoaded', function() {
    const videoGrid = document.querySelector('.video-grid-container');
    const aboutButton = document.getElementById('about-button');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutModalButton = document.getElementById('close-about-modal'); // Corrected ID
    
    const welcomeModal = document.getElementById('welcome-modal');
    const startButton = document.getElementById('start-button');
    const autoplayToggle = document.getElementById('autoplay-toggle');

    let autoplayIntervalId = null; // For the main loop that tries to start new videos
    let activeAutoplayTimeouts = []; // To store timeouts for individual video auto-pauses
    let isAutoplaying = false;

    // IMPORTANT: Replace these placeholder URLs with your actual 15 Cloudinary video URLs
    const videoUrls = [
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885256/bowls_15_zivj1u.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885254/bowls_14_s7obkm.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885254/bowls_9_for07a.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885251/bowls_12_i87u5o.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885251/bowls_4_u3ym1e.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885250/bowls_11_nikx5a.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885250/bowls_3_jbbgn3.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885249/bowls_2_geialj.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885249/bowls_7_rxrztw.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885244/bowls_6_wpzrih.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885243/bowls_1_vajs27.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885243/bowls_8_rnp6l7.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885243/bowls_13_onj1h2.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885242/bowls_5_wuwrev.mp4",
        "https://res.cloudinary.com/dazckbnuv/video/upload/v1747885242/bowls_10_praatz.mp4"
    ];

    // Welcome Modal functionality
    if (welcomeModal && startButton) {
        // Show welcome modal on page load (already done by adding 'show' class in HTML)
        // setTimeout(() => { welcomeModal.classList.add('show'); }, 50); // Small delay for CSS transition

        startButton.addEventListener('click', function() {
            welcomeModal.classList.remove('show');
        });
    }

    // About Modal functionality
    if (aboutButton && aboutModal && closeAboutModalButton) {
        aboutButton.addEventListener('click', function(event) {
            event.preventDefault();
            aboutModal.classList.add('show');
        });

        closeAboutModalButton.addEventListener('click', function() {
            aboutModal.classList.remove('show');
        });

        // Close modal if backdrop is clicked
        aboutModal.addEventListener('click', function(event) {
            if (event.target === aboutModal) {
                aboutModal.classList.remove('show');
            }
        });
    }

    // Video grid and play/pause button functionality
    if (videoGrid) {
        videoUrls.forEach((url, index) => {
            const isPlaceholder = url.startsWith("YOUR_VIDEO_URL_");
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'video-wrapper'; 

            if (url && !isPlaceholder) {
                const videoElement = document.createElement('video');
                
                // Apply f_auto,q_auto transformations for the video source
                const optimizedVideoUrl = url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
                videoElement.src = optimizedVideoUrl;
                
                videoElement.muted = false;
                videoElement.loop = true;
                videoElement.playsInline = true;
                videoElement.preload = 'metadata';

                // Generate poster URL from the original video URL, adding so_0, f_auto, q_auto and changing format
                // Example: .../upload/v123/video.mp4 -> .../upload/so_0,f_auto,q_auto/v123/video.jpg
                const posterTransformations = 'so_0,f_auto,q_auto';
                let posterUrl = url.replace('/video/upload/', `/video/upload/${posterTransformations}/`);
                posterUrl = posterUrl.replace(/\.(mp4|webm|mov|avi|wmv|flv|mkv)$/i, '.jpg'); // Replace common video extensions with .jpg
                videoElement.poster = posterUrl;

                const playButton = document.createElement('button');
                playButton.className = 'play-pause-button'; // CSS class remains for styling
                playButton.innerHTML = '&#9658;'; // Play icon

                // Clicking the play button
                playButton.addEventListener('click', function(e) {
                    e.stopPropagation(); 
                    if (videoElement.paused) {
                        videoElement.play().catch(error => console.log(`Error playing video ${index + 1}: `, error));
                    } 
                    // No 'else' to pause, as clicking video itself will pause
                });

                // Clicking the video to pause
                videoElement.addEventListener('click', function() {
                    if (!videoElement.paused) {
                        videoElement.pause();
                    }
                    // If video is already paused, clicking it does nothing here.
                    // The play button is responsible for starting playback.
                });
                
                // Update play button visibility based on video state
                videoElement.onplay = () => {
                    playButton.style.display = 'none'; // Hide play button when playing
                };
                videoElement.onpause = () => {
                    playButton.style.display = 'flex'; // Show play button when paused
                };
                
                // Initial state: video is paused, so button should be visible
                playButton.style.display = 'flex';


                videoWrapper.appendChild(videoElement);
                videoWrapper.appendChild(playButton); // Add the play button
                videoGrid.appendChild(videoWrapper);

            } else {
                console.warn(`Placeholder URL found for video ${index + 1}. Please update script.js.`);
                const placeholderDiv = document.createElement('div');
                placeholderDiv.className = 'video-placeholder video-wrapper';
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

    // Autoplay functionality
    function playRandomVideoWithRandomDuration() {
        if (!isAutoplaying) return;

        const videoElements = Array.from(videoGrid.querySelectorAll('video'));
        const pausedVideos = videoElements.filter(video => video.paused);

        if (pausedVideos.length === 0) {
            // console.log("Autoplay: No paused videos available to play.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * pausedVideos.length);
        const videoToPlay = pausedVideos[randomIndex];
        
        const minDuration = 5000; // 5 seconds
        const maxDuration = 30000; // 30 seconds
        const randomDuration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;

        // console.log(`Autoplay: Playing video for ${randomDuration / 1000}s`);
        videoToPlay.play().catch(error => console.log('Autoplay play error:', error));

        const timeoutId = setTimeout(() => {
            if (isAutoplaying) { // Only pause if autoplay is still active
                 videoToPlay.pause();
                // console.log("Autoplay: Paused video after duration");
            }
            // Remove this timeoutId from the active list
            activeAutoplayTimeouts = activeAutoplayTimeouts.filter(id => id !== timeoutId);
        }, randomDuration);
        
        activeAutoplayTimeouts.push(timeoutId);
    }

    function startAutoplay() {
        if (isAutoplaying) return;
        isAutoplaying = true;
        // console.log("Autoplay: Started");

        // Clear any existing main interval and individual video timeouts
        if (autoplayIntervalId) clearInterval(autoplayIntervalId);
        activeAutoplayTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        activeAutoplayTimeouts = [];

        // Pause all videos before starting to ensure a clean slate
        // const allVideos = videoGrid.querySelectorAll('video');
        // allVideos.forEach(vid => vid.pause()); // Decided against this to allow user-played videos to continue if desired. Autoplay will only pick paused videos.


        // Start the loop to try and play new videos
        // The interval determines how often a *new* video might be started.
        // Shorter interval = more videos potentially starting more frequently.
        autoplayIntervalId = setInterval(playRandomVideoWithRandomDuration, 2000); // Try to start a new video every 2 seconds
    }

    function stopAutoplay() {
        if (!isAutoplaying) return;
        isAutoplaying = false;
        // console.log("Autoplay: Stopped");

        if (autoplayIntervalId) {
            clearInterval(autoplayIntervalId);
            autoplayIntervalId = null;
        }

        // Clear all scheduled auto-pauses
        activeAutoplayTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        activeAutoplayTimeouts = [];

        // Pause all videos that might have been started by autoplay
        // This will also pause videos played manually if the user wants a full stop.
        // If only autoplayed videos should stop, more complex tracking is needed.
        // For now, stopping autoplay means stopping all videos.
        const allVideos = videoGrid.querySelectorAll('video');
        allVideos.forEach(vid => {
            if (!vid.paused) {
                vid.pause();
            }
        });
    }

    if (autoplayToggle) {
        autoplayToggle.addEventListener('change', function() {
            if (this.checked) {
                startAutoplay();
            } else {
                stopAutoplay();
            }
        });
    }
});
