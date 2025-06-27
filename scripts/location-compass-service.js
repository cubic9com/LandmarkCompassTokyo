// ========================================
// LOCATION & COMPASS SERVICE
// ========================================

/**
 * Integrated location and compass service
 * Handles both GPS location and device orientation functionality
 */
const LocationCompassService = {
    
    // ========================================
    // LOCATION FUNCTIONS
    // ========================================
    
    /**
     * Gets the current location using the Geolocation API
     * Handles success and error cases with appropriate UI updates
     */
    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                AppState.location.current = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                UIController.updateStatus('location-status', getText('locationSuccess'));
                UIController.hideLoadingSpinner();
                UIController.attachLandmarkEventListeners();
                UIController.showLandmarkImages();
                CalculationUtils.calculateAllDirections();
            },
            function(error) {
                let errorMessage = getText('locationError');
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += getText('locationDenied');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += getText('locationUnavailable');
                        break;
                    case error.TIMEOUT:
                        errorMessage += getText('locationTimeout');
                        break;
                    default:
                        errorMessage += getText('locationUnknownError');
                        break;
                }
                UIController.updateStatus('location-status', errorMessage);
                UIController.hideLoadingSpinner();
            },
            locationOptions
        );
    },
    
    /**
     * Optimized location update handler with position change filtering
     * Only processes significant location changes to reduce unnecessary calculations
     * @param {GeolocationPosition} position - Geolocation position object
     */
    handleLocationUpdate(position) {
        const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        // Filter out insignificant position changes (approximately 10m threshold)
        if (AppState.location.current) {
            const latDiff = Math.abs(newLocation.lat - AppState.location.current.lat);
            const lngDiff = Math.abs(newLocation.lng - AppState.location.current.lng);
            
            // Skip update if change is less than ~10 meters (0.0001 degrees ≈ 11m)
            if (latDiff < 0.0001 && lngDiff < 0.0001) {
                return;
            }
        }
        
        // Apply debouncing to location updates
        DebounceManager.debounce('location', () => {
            AppState.location.current = newLocation;
            CalculationUtils.calculateAllDirections();
        }, DebounceManager.LOCATION_DELAY);
    },
    
    /**
     * Starts continuous location monitoring using watchPosition
     * Updates current position and recalculates directions when location changes
     */
    startWatchingLocation() {
        if (navigator.geolocation && !AppState.location.isWatching) {
            const watchId = navigator.geolocation.watchPosition(
                this.handleLocationUpdate,
                function(error) {
                    console.log('Location monitoring error:', error);
                },
                locationOptions
            );
            
            AppState.location.watchId = watchId;
            AppState.location.isWatching = true;
        }
    },
    
    /**
     * Manually refreshes location information when the refresh button is clicked
     * Updates UI state and triggers a new location acquisition
     */
    refreshLocation() {
        const button = document.getElementById('refresh-btn');
        if (button) {
            button.textContent = getText('refreshing');
            button.disabled = true;
        }
        
        UIController.updateStatus('location-status', getText('locationUpdating'));
        UIController.showLoadingSpinner();
        
        this.getCurrentLocation();

        button.textContent = getText('refreshButton');
        button.disabled = false;
        
        setTimeout(() => {
            if (button) {
                button.textContent = getText('refreshButton');
                button.disabled = false;
            }
        }, 10000);
    },
    
    // ========================================
    // COMPASS FUNCTIONS
    // ========================================
    
    /**
     * Initializes the device compass sensor and sets up orientation event listeners
     * Handles both deviceorientationabsolute and deviceorientation events for cross-platform compatibility
     */
    startCompass() {
        if (AppState.compass.isActive) return; // Prevent duplicate initialization
        
        AppState.compass.isActive = true;
        UIController.updateStatus('compass-status', getText('compassSuccess'));
        
        /**
         * Optimized orientation event handler with throttling
         * Reduces CPU usage and battery consumption significantly
         * @param {DeviceOrientationEvent} event - Device orientation event
         */
        function handleOrientationEvent(event) {
            let heading = event.alpha;
            
            // For iOS, use webkitCompassHeading
            if (event.webkitCompassHeading) {
                heading = event.webkitCompassHeading;
            } else if (heading !== null) {
                heading = 360 - heading;
            }
            
            if (heading !== null) {
                // Apply throttling to orientation updates
                DebounceManager.throttle('orientation', () => {
                    AppState.compass.currentHeading = heading;
                    LocationCompassService.updateCompass(heading);
                    LandmarkRenderer.updateAllLines();
                }, DebounceManager.ORIENTATION_DELAY);
            }
        }
        
        // Check if deviceorientationabsolute is available
        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientationEvent);
        } else {
            window.addEventListener('deviceorientation', handleOrientationEvent);
        }
    },
    
    /**
     * Updates the compass display using cached DOM references
     * Eliminates repeated DOM queries for better performance
     * @param {number} heading - The device heading in degrees
     */
    updateCompass(heading) {
        // Use cached compass directions element
        if (DOMCache.compassDirections) {
            DOMCache.compassDirections.style.transform = `rotate(${-heading}deg)`;
        }
        
        // Use cached direction elements
        if (DOMCache.directions.north) {
            DOMCache.directions.north.style.transform = `translateX(-50%) rotate(${heading}deg)`;
        }
        if (DOMCache.directions.east) {
            DOMCache.directions.east.style.transform = `translateY(-50%) rotate(${heading}deg)`;
        }
        if (DOMCache.directions.south) {
            DOMCache.directions.south.style.transform = `translateX(-50%) rotate(${heading}deg)`;
        }
        if (DOMCache.directions.west) {
            DOMCache.directions.west.style.transform = `translateY(-50%) rotate(${heading}deg)`;
        }
    }
};

// Export for global access
window.LocationCompassService = LocationCompassService;
