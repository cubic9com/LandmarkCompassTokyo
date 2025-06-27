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
     * Clear all cached references (useful for cleanup)
     */
    clear() {
        this.landmarks.clear();
        this.lines.clear();
        this.initialized = false;
    }
};

// Export for global access
window.DOMCache = DOMCache;
