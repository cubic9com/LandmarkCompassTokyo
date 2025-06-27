// ========================================
// MAIN APPLICATION CONTROLLER
// ========================================

/**
 * Main application controller
 * Handles initialization, coordination between modules, and global event listeners
 */
const AppController = {
    
    /**
     * Dynamically creates landmark elements with distance display capability
     * Generates compass lines, landmark icons, and distance labels for each landmark
     */
    createLandmarkElements() {
        const compassCircle = document.querySelector('.compass-circle');
        if (!compassCircle || AppState.ui.landmarkElementsCreated) return;
        
        // Create elements for each landmark
        Object.keys(landmarks).forEach(landmarkId => {
            // Create compass line
            const lineElement = document.createElement('div');
            lineElement.className = 'compass-line';
            lineElement.id = `line-${landmarkId}`;
            
            // Create distance display element on the line
            const distanceElement = document.createElement('div');
            distanceElement.className = 'line-distance';
            distanceElement.id = `distance-${landmarkId}`;
            distanceElement.textContent = '--'; // Placeholder until location is acquired
            lineElement.appendChild(distanceElement);
            
            compassCircle.appendChild(lineElement);
            
            // Create compass landmark container
            const landmarkElement = document.createElement('div');
            landmarkElement.className = 'compass-landmark';
            landmarkElement.id = `compass-${landmarkId}`;
            
            // Create image element
            const imgElement = document.createElement('img');
            imgElement.src = `images/${landmarkId}.png`;
            imgElement.alt = landmarkId;
            landmarkElement.appendChild(imgElement);
            
            compassCircle.appendChild(landmarkElement);
        });
        
        AppState.ui.landmarkElementsCreated = true;
    },
    
    /**
     * Initializes the main application with both location and compass functionality
     * Shows loading spinner and starts location acquisition process
     */
    initializeApp() {
        UIController.updateStatus('location-status', getText('locationGetting'));
        UIController.showLoadingSpinner();
        
        // Get location information
        if (navigator.geolocation) {
            LocationCompassService.getCurrentLocation();
            LocationCompassService.startWatchingLocation();
        } else {
            UIController.updateStatus('location-status', getText('locationNotSupported'));
            UIController.hideLoadingSpinner();
        }
    },
    
    /**
     * Initialize the application when DOM is loaded
     */
    initialize() {
        // Initialize DOM cache for performance optimization
        DOMCache.initialize();
        
        // Create landmark elements dynamically
        this.createLandmarkElements();
        
        // Show integrated privacy and permission modal for all devices
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            UIController.showSensorPermissionDialog(); // iOS 13+ with permission request
        } else if (window.DeviceOrientationEvent) {
            UIController.showSensorPermissionDialog(); // Other devices with privacy information
        } else {
            UIController.updateStatus('compass-status', getText('compassNotSupported'));
            this.initializeApp();
        }
    },
    
    /**
     * Debug function to display current application state in console
     * Useful for troubleshooting and development purposes
     */
    showDebugInfo() {
        console.log('=== Application State Debug Info ===');
        console.log('Location:', AppState.location);
        console.log('Compass:', AppState.compass);
        console.log('UI:', AppState.ui);
        console.log('Sensors:', AppState.sensors);
        console.log('Landmarks:', landmarks);
        console.log('=====================================');
    },
    
    /**
     * Resets application state (useful for testing or error recovery)
     */
    resetAppState() {
        // Stop location watching if active
        if (AppState.location.watchId !== null) {
            navigator.geolocation.clearWatch(AppState.location.watchId);
        }
        
        // Reset all state
        AppState.location = {
            current: null,
            watchId: null,
            isWatching: false,
            lastUpdateTime: null
        };
        AppState.compass = {
            currentHeading: 0,
            isSupported: false,
            isActive: false,
            lastUpdateTime: null
        };
        AppState.ui = {
            isLoadingSpinnerVisible: false,
            landmarkElementsCreated: false,
            eventListenersAttached: false,
            modalEventListenersAttached: false
        };
        AppState.sensors = {
            orientationSupported: false,
            permissionGranted: false
        };
        
        console.log('Application state has been reset');
    }
};

// ========================================
// GLOBAL FUNCTIONS (for backward compatibility)
// ========================================

/**
 * Global refresh function for the refresh button onclick
 */
function refreshLocation() {
    LocationCompassService.refreshLocation();
}

// ========================================
// EVENT LISTENERS
// ========================================

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AppController.initialize();
});

// Stop watchPosition, clear debounce timers, and clean up DOM cache when leaving the page
window.addEventListener('beforeunload', function() {
    if (AppState.location.watchId !== null) {
        navigator.geolocation.clearWatch(AppState.location.watchId);
    }
    // Clear all pending debounce timers for cleanup
    DebounceManager.clearAll();
    // Clear DOM cache for memory cleanup
    DOMCache.clear();
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
});

// Expose debug functions globally
window.showDebugInfo = AppController.showDebugInfo;
window.resetAppState = AppController.resetAppState;
window.DEBUG_MODE = false; // Set to true for development

// Export for global access
window.AppController = AppController;
