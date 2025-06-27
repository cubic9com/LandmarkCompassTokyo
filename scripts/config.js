// Landmark coordinate data
const landmarks = {
    'tower': {
        latitude: 35.6586,
        longitude: 139.7454
    },
    'tree': {
        latitude: 35.7101,
        longitude: 139.8107
    },
    'fuji': {
        latitude: 35.3606,
        longitude: 138.7274
    }
};

// Privacy-focused location options for minimal data collection
const locationOptions = {
    enableHighAccuracy: false, // Battery saving and privacy protection
    timeout: 30000,
    maximumAge: 60000 // 1 minutes cache for privacy and performance
};

// Distance unit configuration
// To switch between units, change 'currentUnit' value:
// - 'km': Displays distances in kilometers and meters (metric)
// - 'miles': Displays distances in miles and feet (imperial)
const distanceConfig = {
    defaultUnit: 'km', // 'km' or 'miles'
    currentUnit: 'km'  // Change this to 'miles' to use imperial units
};

// Export for global access
window.landmarks = landmarks;
window.locationOptions = locationOptions;
window.distanceConfig = distanceConfig;
