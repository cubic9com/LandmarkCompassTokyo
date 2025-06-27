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
     * Updates the position of a landmark icon on the compass using cached DOM references
     * Converts polar coordinates to cartesian coordinates for positioning
     * @param {string} landmarkId - The ID of the landmark to update
     * @param {number} bearing - The bearing angle in degrees
     */
    updateCompassLandmark(landmarkId, bearing) {
        const compassLandmarkElement = DOMCache.getLandmarkElement(landmarkId);
        if (compassLandmarkElement) {
            const relativeBearing = bearing - AppState.compass.currentHeading;
            
            // Use cached compass circle for size calculation
            const compassSize = DOMCache.compassCircle ? DOMCache.compassCircle.offsetWidth : 300;
            const radius = (compassSize / 2) - 20; // Subtract margin from compass radius
            
            // Convert polar coordinates to cartesian coordinates
            const angleRad = (relativeBearing - 90) * Math.PI / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            // Get image dimensions
            const imgElement = compassLandmarkElement.querySelector('img');
            let imageWidth = null;
            let imageHeight = null;
            
            if (imgElement && imgElement.offsetWidth > 0) {
                imageWidth = imgElement.offsetWidth;
                imageHeight = imgElement.offsetHeight;
            }
            
            // Position relative to compass center
            compassLandmarkElement.style.left = '50%';
            compassLandmarkElement.style.top = '50%';
            compassLandmarkElement.style.marginLeft = - (imageWidth / 2) + 'px';
            compassLandmarkElement.style.marginTop = - imageHeight + 20 + 'px';
            
            // Apply final transform
            compassLandmarkElement.style.transform = `translate(${x}px, ${y}px)`;
            
            // Draw line from compass center to landmark icon center
            this.updateCompassLine(landmarkId, relativeBearing);
        }
    },
    
    /**
     * Updates all landmark positions on the compass when device orientation changes
     * Recalculates and repositions all landmark icons and distance displays based on current heading
     */
    updateAllLines() {
        if (!AppState.location.current) return;
        
        Object.keys(landmarks).forEach(landmarkId => {
            const landmark = landmarks[landmarkId];
            const bearing = CalculationUtils.calculateBearing(
                AppState.location.current.lat, AppState.location.current.lng,
                landmark.latitude, landmark.longitude
            );
            const distance = CalculationUtils.calculateDistance(
                AppState.location.current.lat, AppState.location.current.lng,
                landmark.latitude, landmark.longitude
            );
            
            // Update both landmark position and distance display
            this.updateCompassLandmark(landmarkId, bearing);
            this.updateLandmarkDistance(landmarkId, distance, bearing);
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
