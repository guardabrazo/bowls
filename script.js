document.addEventListener('DOMContentLoaded', function() {
    const videoGrid = document.querySelector('.video-grid-container');
    const aboutButton = document.getElementById('about-button');
    const aboutModal = document.getElementById('about-modal');
    const closeButton = document.querySelector('.close-button');

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

    // Modal functionality
    if (aboutButton && aboutModal && closeButton) {
        aboutButton.addEventListener('click', function(event) {
            event.preventDefault();
            aboutModal.classList.add('show');
        });

        closeButton.addEventListener('click', function() {
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
            videoWrapper.className = 'video-wrapper'; // For positioning the button

            if (url && !isPlaceholder) {
                const videoElement = document.createElement('video');
                videoElement.src = url;
                videoElement.muted = false;
                videoElement.loop = true;
                videoElement.playsInline = true;

                const playPauseButton = document.createElement('button');
                playPauseButton.className = 'play-pause-button';
                playPauseButton.innerHTML = '&#9658;'; // Play icon

                playPauseButton.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent click from bubbling to videoWrapper if needed
                    if (videoElement.paused) {
                        videoElement.play().catch(error => console.log(`Error playing video ${index + 1}: `, error));
                        playPauseButton.innerHTML = '&#10074;&#10074;'; // Pause icon
                    } else {
                        videoElement.pause();
                        playPauseButton.innerHTML = '&#9658;'; // Play icon
                    }
                });
                
                // Update button on video events (e.g. if video ends and loops, or is paused by other means)
                videoElement.onplay = () => playPauseButton.innerHTML = '&#10074;&#10074;';
                videoElement.onpause = () => playPauseButton.innerHTML = '&#9658;';

                videoWrapper.appendChild(videoElement);
                videoWrapper.appendChild(playPauseButton);
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
});
