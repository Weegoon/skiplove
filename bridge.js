function success_load(){
    sendCustomAnalyticsEvent("game_load", {});

    setTimeout(() => {
        refreshStickyBannerAd();
        StickyBannerInstance = window?.GlanceGamingAdInterface?.showStickyBannerAd(StickyObj, bannerCallbacks);
        
        replayInstance = window.GlanceGamingAdInterface.loadRewardedAd(replayObj, rewardedCallbacks);
        rewardInstance = window.GlanceGamingAdInterface.loadRewardedAd(rewardObj, rewardedCallbacks);
    }, 1000)          
}

// send analytics event
function gameEvent(eventName, extras) {
    switch (eventName) {
        case "game_start":
            sendCustomAnalyticsEvent("game_start", {});
            break;
        case "game_end":
            sendCustomAnalyticsEvent("game_end", { level: parseInt(extras)});
            break;
        case "game_level":
            sendCustomAnalyticsEvent("game_level", { level: parseInt(extras) });
            break;
        case "game_replay":
            sendCustomAnalyticsEvent("game_replay", { level: parseInt(extras)});
            break;
        case "level_completed":
            sendCustomAnalyticsEvent("level_completed", { level: parseInt(extras) });
        break;
        default:
    }
}

//  config sound function for third party API
function enableSound(boolean) {
    var stringVar = boolean.toString();
    myGameInstance.SendMessage('ShowAds', 'EnableSound', stringVar);
} 

// implemention function for testing tool
function pauseEvent() {
    myGameInstance.SendMessage('ShowAds', 'pauseEvent');
}

function resumeEvent() {
    myGameInstance.SendMessage('ShowAds', 'resumeEvent');
}

function replayGameEvent() {
    myGameInstance.SendMessage('ShowAds', 'replayGameEvent');
}

function nextLevelEvent() {
    myGameInstance.SendMessage('ShowAds', 'nextLevelEvent');
}

function gotoHomeEvent() {
    myGameInstance.SendMessage('ShowAds', 'gotoHomeEvent');
}

function gotoLevel(levelNo) {
    var stringVar = levelNo.toString();
    myGameInstance.SendMessage('ShowAds', 'gotoLevel', stringVar);
}

function gameEndEvent() {
    myGameInstance.SendMessage('ShowAds', 'gameEndEvent');
}

function getLoadingPerc() {
    if (loadingPerc >= 100) {
        loadingPerc = 100;
    }
    return Math.ceil(loadingPerc);
}

function setWindowTopMargin(margin) {
    // Get game canvas element. Canvas ID may vary.
    const canvas = document.getElementById("unity-container");
    const height = window.innerHeight;
    const width = window.innerWidth;
    const isLandscape = width > height;
    if (isLandscape) {
        canvas.style.marginLeft = `${margin}px`;
    }
    else {
        canvas.style.marginTop = `${margin}px`;
    }
}

// State Save API
function getUserId() {
    var userid = location.search.substring(1).split("&").find((a) => { return a.startsWith('userid') });
    if (userid != null)
        return userid.split("=")[1]
    else
        return "1234"
}

function getGameId() {
    var gameid = location.search.substring(1).split("&").find((a) => { return a.startsWith('gameId') });
    if (gameid != null)
        return gameid.split("=")[1]
    else
        return "weegoon_ragdolljump"
}

function saveUserData(data){
    var jsonObj = JSON.parse(data);
    const userState = saveUserState(jsonObj);   // call function from local.js
    userState.then((info) => {
        console.log("Save User State: ", info);
    }).catch((error) => {
        console.log("Unable to save the user state: ", error);
});    
}

function getUserData(){
    const userState = GetUserState(getUserId(), getGameId());  // call function from local.js
    userState.then((info) => {
        if (Array.isArray(info) || info.length != 0) {
            var jsonString = JSON.stringify(info[0]);
            // Game logic
            myGameInstance.SendMessage('ShowAds', 'HandleUserData', jsonString);
          }        
    }).catch((error) => {
        console.log("Unable to get user data: ", error);
    });
}

// Get Device language
function getDeviceLanguage() {
    var lan = location.search.substring(1).split("&").find((a) => { return a.startsWith('hl') });
    if (lan == null) {
        return "en"
    } else {
        return lan.split("=")[1]
    }
}

// Reward callback functions
function rewardSuccess(){
    console.log("reward success");
    myGameInstance.SendMessage('ShowAds', 'OnRewardAdsClosed');
}

function rewardFailure(){
    console.log("reward failure");
}

