// Multilingual text data
const translations = {
    en: {
        title: "Landmark Compass Tokyo",
        subtitle: "Shows directions to landmarks in Tokyo",
        description: "Try this when you go up to a high place in Tokyo",
        north: "N",
        east: "E",
        south: "S",
        west: "W",
        locationGetting: "🔃 Getting location...",
        compassInitializing: "🔃 Initializing compass sensor...",
        compassChecking: "🔃 Checking compass sensor...",
        locationSuccess: "✅ Location acquired",
        locationError: "❌ Failed to get location: ",
        locationNotSupported: "❌ Geolocation is not supported",
        locationDenied: "❌ Location access denied",
        locationUnavailable: "Location unavailable",
        locationTimeout: "Request timed out",
        locationUnknownError: "Unknown error",
        compassSuccess: "✅ Compass sensor available",
        compassDenied: "❌ Compass sensor access denied",
        compassPermissionError: "❌ Failed to get compass permission",
        compassNotSupported: "❌ Compass sensor not supported",
        refreshButton: "Refresh Location",
        refreshing: "🔃 Refreshing...",
        locationUpdating: "🔃 Updating location...",
        loadingLocation: "Getting location...",
        sensorPermissionTitle: "To Show Directions",
        sensorPermissionDescription: "This app needs access to your location and device orientation to show directions to landmarks.",
        privacyDetail1: "Location and orientation data is processed only on your device",
        privacyDetail2: "Location is used only for calculating directions to landmarks",
        privacyDetail3: "Compass sensor is used only to detect device orientation",
        privacyDetail4: "No personal information is collected or transmitted",
        cancelButton: "Don't Allow",
        okButton: "Allow",
        permissionsRequired: "Location and compass sensor permissions are required for this app",
        githubLink: "Source code is available on GitHub"
    },
    ja: {
        title: "Landmark Compass Tokyo",
        subtitle: "東京の各ランドマークの方角を表示します",
        description: "東京で高いところに登ったら、使ってみてください",
        north: "北",
        east: "東",
        south: "南",
        west: "西",
        locationGetting: "🔃 位置情報を取得中...",
        compassInitializing: "🔃 方位センサーを初期化中...",
        compassChecking: "🔃 方位センサーを確認中...",
        locationSuccess: "✅ 位置情報を取得しました",
        locationError: "❌ 位置情報の取得に失敗: ",
        locationNotSupported: "❌ 位置情報がサポートされていません",
        locationDenied: "❌ 位置情報の使用が拒否されました",
        locationUnavailable: "位置情報が利用できません",
        locationTimeout: "タイムアウトしました",
        locationUnknownError: "不明なエラー",
        compassSuccess: "✅ 方位センサーが利用可能です",
        compassDenied: "❌ 方位センサーの使用が拒否されました",
        compassPermissionError: "❌ 方位センサーの許可取得に失敗",
        compassNotSupported: "❌ 方位センサーがサポートされていません",
        refreshButton: "位置情報を更新",
        refreshing: "🔃 更新中...",
        locationUpdating: "🔃 位置情報を更新中...",
        loadingLocation: "位置情報を取得中...",
        sensorPermissionTitle: "方角を表示するために",
        sensorPermissionDescription: "ランドマークへの方角を表示するため、位置情報とデバイスの向きの取得の許可が必要です。",
        privacyDetail1: "位置情報およびデバイスの向きの情報はお使いのデバイス上でのみ処理されます",
        privacyDetail2: "位置情報はランドマークの方角計算のみに使用されます",
        privacyDetail3: "方位センサーはデバイスの向きを検出するためのみに使用されます",
        privacyDetail4: "個人情報の収集や外部送信は一切行いません",
        cancelButton: "許可しない",
        okButton: "許可する",
        permissionsRequired: "本アプリを使用するには位置情報と方位センサーの権限が必要です",
        githubLink: "ソースコードはGitHubにて公開中"
    }
};

// Get current language
function getCurrentLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('ja') ? 'ja' : 'en';
}

// Function to get text
function getText(key) {
    const lang = getCurrentLanguage();
    return translations[lang][key] || translations['en'][key] || key;
}

// Set HTML language attribute
function setHtmlLang() {
    document.documentElement.lang = getCurrentLanguage();
}

// Update page texts
function updatePageTexts() {
    // Title
    document.title = getText('title');
    
    // Header
    const h1 = document.querySelector('header h1');
    if (h1) h1.textContent = `🗼 ${getText('title')} 🗼`;
    
    const subtitleP = document.querySelector('header p:first-of-type');
    if (subtitleP) subtitleP.textContent = getText('subtitle');
    
    const descriptionP = document.querySelector('header p:last-of-type');
    if (descriptionP) descriptionP.textContent = getText('description');
    
    // Direction display
    const northEl = document.querySelector('.direction.north');
    if (northEl) northEl.textContent = getText('north');
    
    const eastEl = document.querySelector('.direction.east');
    if (eastEl) eastEl.textContent = getText('east');
    
    const southEl = document.querySelector('.direction.south');
    if (southEl) southEl.textContent = getText('south');
    
    const westEl = document.querySelector('.direction.west');
    if (westEl) westEl.textContent = getText('west');
    
    // Button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn && !refreshBtn.disabled) {
        refreshBtn.textContent = getText('refreshButton');
    }
    
    // Modal dialog
    const sensorTitleEl = document.getElementById('sensor-permission-title');
    if (sensorTitleEl) sensorTitleEl.textContent = getText('sensorPermissionTitle');
    
    const sensorDescriptionEl = document.getElementById('sensor-permission-description');
    if (sensorDescriptionEl) sensorDescriptionEl.textContent = getText('sensorPermissionDescription');
    
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) cancelBtn.textContent = getText('cancelButton');
    
    const okBtn = document.getElementById('ok-btn');
    if (okBtn) okBtn.textContent = getText('okButton');

    // GitHub link
    const githubLink = document.getElementById('github-link');
    if (githubLink) githubLink.textContent = getText('githubLink');
}

// Apply language settings on initialization
document.addEventListener('DOMContentLoaded', function() {
    setHtmlLang();
    updatePageTexts();
});
