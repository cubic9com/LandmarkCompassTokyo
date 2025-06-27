// ========================================
// STATE MANAGEMENT
// ========================================

/**
 * Centralized application state management
 * Replaces scattered global variables with organized state object
 */
const AppState = {
    location: {
        current: null,
        watchId: null,
        isWatching: false,
        lastUpdateTime: null
    },
    compass: {
        currentHeading: 0,
        isSupported: false,
        isActive: false,
        lastUpdateTime: null
    },
    ui: {
        isLoadingSpinnerVisible: false,
        landmarkElementsCreated: false,
        eventListenersAttached: false,
        modalEventListenersAttached: false
    },
    sensors: {
        orientationSupported: false,
        permissionGranted: false
    }
};

// Export for global access
window.AppState = AppState;
