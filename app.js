
function AppControls() {
    var self = this;

    // local constants
    var tickIntervalID = -1;
    var tickInterval = 1000;

    self.createElements = function() {
        self.controls = document.createElement("DIV");
        self.controls.id = "controls";

        self.pauseButton = document.createElement("BUTTON");
        self.pauseButton.id = "pauseButton";

        self.saveButton = document.createElement("BUTTON");
        self.saveButton.id = "saveButton";
        self.saveButton.innerHTML = "Save";

        self.resetButton = document.createElement("BUTTON");
        self.resetButton.id = "resetButton";
        self.resetButton.innerHTML = "Reset";
    };

    self.addDomElements = function() {
        self.controls.appendChild(self.pauseButton);
        self.controls.appendChild(self.saveButton);
        self.controls.appendChild(self.resetButton);
        document.body.appendChild(self.controls);
    };

    self.saveAction = function() {
        saveToNetwork(getCookie('saveID'));
    };

    self.resetAction = function() {
        $('nodes').innerHTML = "";
        nodes = [];
        addInitialNodes();
    };

    self.togglePause = function() {
        if (tickIntervalID == -1) {
            $('pauseButton').innerHTML = 'Pause';
            tickIntervalID = setInterval(updateAll, tickInterval);
        } else {
            $('pauseButton').innerHTML = 'Unpause';
            clearInterval(tickIntervalID);
            tickIntervalID = -1;
        }
    };

    self.addListeners = function() {
        self.pauseButton.addEventListener("click", self.togglePause);
        self.pauseButton.addEventListener("touchstart", self.togglePause);

        self.saveButton.addEventListener("click", self.saveAction);
        self.saveButton.addEventListener("touchstart", self.saveAction);

        self.resetButton.addEventListener("click", self.resetAction);
        self.resetButton.addEventListener("touchstart", self.resetAction);

        window.addEventListener('keyup', function(e) {
            if (e.keyCode == 32) {
                self.pauseButton.blur();
                self.togglePause();
            }
        });
    };

    self.init = function() {
        self.createElements();
        self.addListeners();
        self.addDomElements();
    }();
}

function app() {
    var self = this;

    self.appControls = new AppControls();

    self.init = function() {
        moveAll();

        deleteCookie('save');
        if (!getCookie('saveID')) {
            setCookie('saveID', getTimestamp());
        }

        loadFromNetwork(getCookie('saveID'));
        updateAll();

        self.appControls.togglePause();
    }();
}

