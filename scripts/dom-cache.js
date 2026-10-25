// ========================================
// DOM CACHE MANAGEMENT
// ========================================

/**
 * Centralized DOM element caching system
 * Improves performance by eliminating repeated DOM queries
 */
const DOMCache = {
    // Core compass elements
    compassCircle: null,
    compassDirections: null,
    
    // Direction elements for N/E/S/W display
    directions: {
        north: null,
        east: null,
        south: null,
        west: null
    },
    
    // UI control elements
    ui: {
        loadingSpinner: null,
        spinnerText: null,
        refreshBtn: null
    },
    
    // Status display elements
    status: {
        location: null,
        compass: null
    },
    
    // Modal elements
    modal: {
        container: null,
        title: null,
        description: null,
        cancelBtn: null,
        okBtn: null
    },
    
    // Dynamic landmark elements cache
    landmarks: new Map(),
    lines: new Map(),

    // Cached size values to avoid repeated layout reads (reflow)
    compassSize: null,
    landmarkImageSizes: new Map(), // { landmarkId -> { width, height } }

    // Cache initialization state
    initialized: false,
    
    /**
     * Initialize all static DOM element references
     * Called once during application startup
     */
    initialize() {
        // Core compass elements
        this.compassCircle = document.querySelector('.compass-circle');
        this.compassDirections = document.querySelector('.compass-directions');
        
        // Direction elements
        this.directions.north = document.querySelector('.direction.north');
        this.directions.east = document.querySelector('.direction.east');
        this.directions.south = document.querySelector('.direction.south');
        this.directions.west = document.querySelector('.direction.west');
        
        // UI elements
        this.ui.loadingSpinner = document.getElementById('loading-spinner');
        this.ui.spinnerText = document.querySelector('.spinner-text');
        this.ui.refreshBtn = document.getElementById('refresh-btn');
        
        // Status elements
        this.status.location = document.getElementById('location-status');
        this.status.compass = document.getElementById('compass-status');
        
        // Modal elements
        this.modal.container = document.getElementById('sensor-permission-modal');
        this.modal.title = document.getElementById('sensor-permission-title');
        this.modal.description = document.getElementById('sensor-permission-description');
        this.modal.cancelBtn = document.getElementById('cancel-btn');
        this.modal.okBtn = document.getElementById('ok-btn');
        
        this.initialized = true;
    },
    
    /**
     * Cache landmark element references dynamically
     * @param {string} landmarkId - The landmark identifier
     */
    cacheLandmarkElements(landmarkId) {
        if (!this.landmarks.has(landmarkId)) {
            const landmarkElement = document.getElementById(`compass-${landmarkId}`);
            const lineElement = document.getElementById(`line-${landmarkId}`);
            
            if (landmarkElement) this.landmarks.set(landmarkId, landmarkElement);
            if (lineElement) this.lines.set(landmarkId, lineElement);
        }
    },
    
    /**
     * Get cached landmark element
     * @param {string} landmarkId - The landmark identifier
     * @returns {HTMLElement|null} The cached element or null
     */
    getLandmarkElement(landmarkId) {
        if (!this.landmarks.has(landmarkId)) {
            this.cacheLandmarkElements(landmarkId);
        }
        return this.landmarks.get(landmarkId) || null;
    },
    
    /**
     * Get cached line element
     * @param {string} landmarkId - The landmark identifier
     * @returns {HTMLElement|null} The cached element or null
     */
    getLineElement(landmarkId) {
        if (!this.lines.has(landmarkId)) {
            this.cacheLandmarkElements(landmarkId);
        }
        return this.lines.get(landmarkId) || null;
    },
    
    /**
     * Read and cache the compass circle size.
     * Call once after initialization, and again on window resize.
     */
    cacheCompassSize() {
        if (this.compassCircle) {
            this.compassSize = this.compassCircle.offsetWidth;
        }
    },

    /**
     * Read and cache the image dimensions of a landmark element.
     * Call once after the landmark images are rendered.
     * @param {string} landmarkId - The landmark identifier
     */
    cacheLandmarkImageSize(landmarkId) {
        const landmarkElement = this.getLandmarkElement(landmarkId);
        if (landmarkElement) {
            const imgElement = landmarkElement.querySelector('img');
            if (imgElement && imgElement.offsetWidth > 0) {
                this.landmarkImageSizes.set(landmarkId, {
                    width: imgElement.offsetWidth,
                    height: imgElement.offsetHeight
                });
            }
        }
    },

    /**
     * Get cached image size for a landmark.
     * @param {string} landmarkId - The landmark identifier
     * @returns {{ width: number, height: number } | null}
     */
    getLandmarkImageSize(landmarkId) {
        if (!this.landmarkImageSizes.has(landmarkId)) {
            this.cacheLandmarkImageSize(landmarkId);
        }
        return this.landmarkImageSizes.get(landmarkId) || null;
    },

    /**
     * Invalidate all size caches (call on window resize / orientation change).
     */
    invalidateSizeCache() {
        this.compassSize = null;
        this.landmarkImageSizes.clear();
    },

    /**
     * Clear all cached references (useful for cleanup)
     */
    clear() {
        this.landmarks.clear();
        this.lines.clear();
        this.landmarkImageSizes.clear();
        this.compassSize = null;
        this.initialized = false;
    }
};

// Export for global access
window.DOMCache = DOMCache;
