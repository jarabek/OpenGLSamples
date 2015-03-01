var lastSessionState = null;

function start() {    
    var oglView = new pureweb.client.View({id: 'oglView', viewName: 'oglView'});
    setDisconnectOnUnload(true);
    var client = pureweb.getClient();
    pureweb.listen(client, pureweb.client.WebClient.EventType.CONNECTED_CHANGED, onConnectedChanged);
    pureweb.connect(location.href);
}

function setDisconnectOnUnload(flag){
    if (flag){
        var f = function(e) {
            if (pureweb.getClient().isConnected()) {
                pureweb.getClient().disconnect(false);
            }
            return null;
        }
        window.onbeforeunload = f;
        window.onunload = f;    
    }
    else
    {
        window.onbeforeunload = null;
        window.onunload = null;    
    }
}

function onConnectedChanged(e) {
    if (e.target.isConnected()) {
        var client = pureweb.getClient();
        pureweb.listen(client, pureweb.client.WebClient.EventType.STALLED_CHANGED, onStalledChanged);
        pureweb.listen(client, pureweb.client.WebClient.EventType.SESSION_STATE_CHANGED, onSessionStateChanged);
    }
}

function onStalledChanged(event) {
    if (pureweb.getClient().isStalled()) {
        pureweb.getClient().logger.fine('stalled');
    } else {
        pureweb.getClient().logger.fine('recovered');
    }
}

function onSessionStateChanged(event) {
    var sessionState = pureweb.getClient().getSessionState();
    if (sessionState === pureweb.client.SessionState.FAILED) {
        if (lastSessionState === pureweb.client.SessionState.CONNECTING) {            
            alert('Unable to connect to the service application.');
        } else {
            alert('Connection to the service application has been lost. Refresh the page to restart.');
        }
    }
    lastSessionState = sessionState;
}
