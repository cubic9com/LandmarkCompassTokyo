// ========================================
// UI CONTROLLER
// ========================================

/**
 * UI Controller for managing user interface updates
 * Handles status updates, loading states, modals, and event listeners
 */
const UIController = {
    
    /**
     * Updates status message using cached DOM references
     * @param {string} elementId - The ID of the element to update
     * @param {string} message - The message to display
     */
    updateStatus(elementId, message) {
        let element = null;
        
        // Use cached status elements for common cases
        switch(elementId) {
            case 'location-status':
                element = DOMCache.status.location;
                break;
            case 'compass-status':
                element = DOMCache.status.compass;
                break;
            default:
                // Fallback to direct query for uncommon elements
                element = document.getElementById(elementId);
        }
        
        if (element) {
            element.textContent = message;
        }
    },
    
    /**
     * Shows the loading spinner with localized text
     * Displays during location acquisition process
     */
    showLoadingSpinner() {
        if (AppState.ui.isLoadingSpinnerVisible) return;
        
        const spinner = document.getElementById('loading-spinner');
        const spinnerText = document.querySelector('.spinner-text');
        if (spinner) {
            spinner.classList.add('show');
            if (spinnerText) {
                spinnerText.textContent = getText('loadingLocation');
            }
            AppState.ui.isLoadingSpinnerVisible = true;
        }
    },
    
    /**
     * Hides the loading spinner
     * Called when location acquisition completes or fails
     */
    hideLoadingSpinner() {
        if (!AppState.ui.isLoadingSpinnerVisible) return;
        
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('show');
            AppState.ui.isLoadingSpinnerVisible = false;
        }
    },
    
    /**
     * Attaches event listeners to landmark elements (called only once)
     * Prevents duplicate event listener registration
     */
    attachLandmarkEventListeners() {
        if (AppState.ui.eventListenersAttached) return;
        
        const landmarkElements = document.querySelectorAll('.compass-landmark');
        landmarkElements.forEach(element => {
            // Add tap event listener to each landmark
            element.addEventListener('click', function() {
                LandmarkRenderer.playLandmarkAnimation(element);
            });
            
            // Add touch event for mobile devices
            element.addEventListener('touchstart', function(e) {
                e.preventDefault(); // Prevent default touch behavior
                LandmarkRenderer.playLandmarkAnimation(element);
            });
        });
        
        AppState.ui.eventListenersAttached = true;
    },
    
    /**
     * Shows landmark images and lines on the compass after location is acquired
     * Separated from event listener attachment to prevent duplication
     */
    showLandmarkImages() {
        const landmarkElements = document.querySelectorAll('.compass-landmark');
        landmarkElements.forEach(element => {
            element.classList.add('visible');
        });
        
        const lineElements = document.querySelectorAll('.compass-line');
        lineElements.forEach(element => {
            element.classList.add('visible');
        });
    },
    
    /**
     * Shows integrated privacy and sensor permission modal
     * Enhanced version with privacy information included in description
     */
    showSensorPermissionDialog() {
        const modal = document.getElementById('sensor-permission-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        const okBtn = document.getElementById('ok-btn');
        
        if (!modal || AppState.ui.modalEventListenersAttached) return;
        
        // Update modal content with integrated localized text
        this.updateIntegratedModalContent();
        
        // Show modal
        modal.classList.add('show');
        
        // Cancel button event listener
        const cancelHandler = function() {
            modal.classList.remove('show');
            UIController.handlePermissionDeclined();
        };
        
        // OK button event listener
        const okHandler = function() {
            modal.classList.remove('show');
            UIController.updateStatus('compass-status', getText('compassInitializing'));
            
            // Request device orientation permission (iOS 13+)
            if (typeof DeviceOrientationEvent !== 'undefined' && 
                typeof DeviceOrientationEvent.requestPermission === 'function') {
                
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            AppState.sensors.permissionGranted = true;
                            AppState.sensors.orientationSupported = true;
                            LocationCompassService.startCompass();
                            AppController.initializeApp();
                        } else {
                            UIController.updateStatus('compass-status', getText('compassDenied'));
                            AppController.initializeApp();
                        }
                    })
                    .catch(error => {
                        console.error('Sensor permission error:', error);
                        UIController.updateStatus('compass-status', getText('compassPermissionError'));
                        AppController.initializeApp();
                    });
            } else {
                // For non-iOS devices, proceed directly
                AppState.sensors.orientationSupported = true;
                LocationCompassService.startCompass();
                AppController.initializeApp();
            }
        };
        
        cancelBtn.addEventListener('click', cancelHandler);
        okBtn.addEventListener('click', okHandler);
        
        AppState.ui.modalEventListenersAttached = true;
    },
    
    /**
     * Updates modal content with integrated localized text
     */
    updateIntegratedModalContent() {
        // Main title and description
        const titleEl = document.getElementById('sensor-permission-title');
        const descriptionEl = document.getElementById('sensor-permission-description');
        
        // Privacy details list items
        const privacyDetail1 = document.getElementById('privacy-detail-1');
        const privacyDetail2 = document.getElementById('privacy-detail-2');
        const privacyDetail3 = document.getElementById('privacy-detail-3');
        const privacyDetail4 = document.getElementById('privacy-detail-4');
        
        // Buttons
        const cancelBtn = document.getElementById('cancel-btn');
        const okBtn = document.getElementById('ok-btn');
        
        // Update content
        if (titleEl) titleEl.textContent = getText('sensorPermissionTitle');
        if (descriptionEl) descriptionEl.textContent = getText('sensorPermissionDescription');
        if (privacyDetail1) privacyDetail1.textContent = getText('privacyDetail1');
        if (privacyDetail2) privacyDetail2.textContent = getText('privacyDetail2');
        if (privacyDetail3) privacyDetail3.textContent = getText('privacyDetail3');
        if (privacyDetail4) privacyDetail4.textContent = getText('privacyDetail4');
        if (cancelBtn) cancelBtn.textContent = getText('cancelButton');
        if (okBtn) okBtn.textContent = getText('okButton');
    },
    
    /**
     * Handle case when user declines permissions
     */
    handlePermissionDeclined() {
        this.updateStatus('compass-status', getText('compassDenied'));
        this.updateStatus('location-status', getText('locationDenied'));
        
        // Show limited functionality message
        this.showLimitedFunctionalityMessage();
    },
    
    /**
     * Shows message about limited functionality when permissions are declined
     */
    showLimitedFunctionalityMessage() {
        const statusDiv = document.querySelector('.status');
        if (statusDiv) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning-message';
            warningDiv.textContent = getText('permissionsRequired');
            statusDiv.appendChild(warningDiv);
        }
    }
};

// Export for global access
window.UIController = UIController;
