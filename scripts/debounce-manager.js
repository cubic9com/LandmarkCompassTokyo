// ========================================
// DEBOUNCE MANAGEMENT
// ========================================

/**
 * Centralized debounce and throttle management system
 * Optimizes performance by controlling event firing frequency
 */
const DebounceManager = {
    timers: new Map(),
    
    // Timing configuration for optimal performance
    ORIENTATION_DELAY: 33.3, // 30FPS (33.3ms interval) for orientation updates
    LOCATION_DELAY: 60000,   // 1 minute interval for location updates
    RENDER_DELAY: 33.3,      // 50ms interval for rendering updates
    
    /**
     * Throttle function - executes immediately, then blocks subsequent calls for delay period
     * @param {string} key - Unique identifier for the throttled function
     * @param {Function} callback - Function to execute
     * @param {number} delay - Delay in milliseconds
     */
    throttle(key, callback, delay) {
        if (!this.timers.has(key)) {
            callback();
            const timer = setTimeout(() => {
                this.timers.delete(key);
            }, delay);
            this.timers.set(key, timer);
        }
    },
    
    /**
     * Debounce function - delays execution until after delay period of inactivity
     * @param {string} key - Unique identifier for the debounced function
     * @param {Function} callback - Function to execute
     * @param {number} delay - Delay in milliseconds
     */
    debounce(key, callback, delay) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }
        
        const timer = setTimeout(() => {
            callback();
            this.timers.delete(key);
        }, delay);
        
        this.timers.set(key, timer);
    },
    
    /**
     * Clear all pending timers (useful for cleanup)
     */
    clearAll() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
    }
};

// Export for global access
window.DebounceManager = DebounceManager;
