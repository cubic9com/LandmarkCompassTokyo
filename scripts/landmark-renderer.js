// ========================================
// LANDMARK RENDERING
// ========================================

/**
 * Landmark rendering and animation controller
 * Handles landmark positioning, distance display, and animations
 */
const LandmarkRenderer = {
    
    /**
     * Updates landmark information with both bearing and distance
     * Enhanced version of existing updateLandmarkInfo function
     * @param {string} landmarkId - The ID of the landmark to update
     * @param {number} bearing - The bearing angle in degrees
     * @param {number} distance - The distance in kilometers
     */
    updateLandmarkInfo(landmarkId, bearing, distance) {
        // Update landmark position on compass
        this.updateCompassLandmark(landmarkId, bearing);
        
        // Update distance display with bearing for rotation
        this.updateLandmarkDistance(landmarkId, distance, bearing);
    },
    
    /**
     * Updates landmark distance display on the compass line
     * @param {string} landmarkId - The landmark identifier
     * @param {number} distanceKm - Distance in kilometers
     * @param {number} bearing - The bearing angle in degrees (not used since rotation is handled by parent line)
     */
    updateLandmarkDistance(landmarkId, distanceKm, bearing) {
        const distanceElement = document.getElementById(`distance-${landmarkId}`);
        if (distanceElement) {
            distanceElement.textContent = CalculationUtils.formatDistance(distanceKm);
        }
    },
    
    /**
     * Updates the position of a landmark icon on the compass using cached DOM references.
     * @param {string} landmarkId - The ID of the landmark to update
     * @param {number} bearing - The bearing angle in degrees
     */
    updateCompassLandmark(landmarkId, bearing) {
        const compassLandmarkElement = DOMCache.getLandmarkElement(landmarkId);
        if (compassLandmarkElement) {
            const relativeBearing = bearing - AppState.compass.currentHeading;

            // Use cached compass size to avoid repeated layout reads (reflow)
            if (DOMCache.compassSize === null) {
                DOMCache.cacheCompassSize();
            }
            const compassSize = DOMCache.compassSize || 300;
            const radius = (compassSize / 2) - 20; // Subtract margin from compass radius

            // Convert polar coordinates to cartesian coordinates
            const angleRad = (relativeBearing - 90) * Math.PI / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            // Use cached image dimensions to avoid repeated layout reads (reflow)
            const imgSize = DOMCache.getLandmarkImageSize(landmarkId);
            const offsetX = imgSize ? -(imgSize.width / 2) : 0;
            const offsetY = imgSize ? -(imgSize.height - 20) : 0;

            // Apply position entirely via a single transform to minimize style recalculations.
            // translate(-50%, -50%) centers the element, then (x, y) moves it to the compass edge,
            // then (offsetX, offsetY) adjusts for image dimensions.
            compassLandmarkElement.style.transform =
                `translate(${x + offsetX}px, ${y + offsetY}px)`;

            // Draw line from compass center to landmark icon
            this.updateCompassLine(landmarkId, relativeBearing);
        }
    },
    
    /**
     * Updates all landmark positions on the compass when device orientation changes.
     */
    updateAllLines() {
        if (!AppState.location.current) return;

        Object.keys(landmarks).forEach(landmarkId => {
            const landmark = landmarks[landmarkId];

            // Recalculate bearing only (heading-dependent)
            const bearing = CalculationUtils.calculateBearing(
                AppState.location.current.lat, AppState.location.current.lng,
                landmark.latitude, landmark.longitude
            );

            // Update landmark icon position only; distance display is unchanged
            this.updateCompassLandmark(landmarkId, bearing);
        });
    },
    
    /**
     * Updates the rotation of a compass line element using cached DOM references
     * @param {string} landmarkId - The ID of the landmark
     * @param {number} relativeBearing - The relative bearing angle in degrees
     */
    updateCompassLine(landmarkId, relativeBearing) {
        const lineElement = DOMCache.getLineElement(landmarkId);
        if (lineElement) {
            lineElement.style.transform = `translateX(-50%) rotate(${relativeBearing}deg)`;
        }
    },
    
    /**
     * Plays a height animation when a landmark icon is tapped
     * Temporarily removes and re-adds the visible class to trigger CSS animation
     * @param {HTMLElement} landmarkElement - The landmark element to animate
     */
    playLandmarkAnimation(landmarkElement) {
        // Remove the visible class temporarily to reset animation
        landmarkElement.classList.remove('visible');
        
        // Force reflow to ensure the class removal takes effect
        landmarkElement.offsetHeight;
        
        // Add the visible class back to trigger the animation
        landmarkElement.classList.add('visible');
    }
};

// Export for global access
window.LandmarkRenderer = LandmarkRenderer;
