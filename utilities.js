function getTimestamp() {
    var d = new Date();
    return d.getTime();
}

function getCookie(name) {
    var cs = document.cookie.split(";");
    for (var i = 0; i < cs.length; i++) {
        var sp = cs[i].indexOf("=");
        if (cs[i].substr(0,sp) == name)
            return cs[i].substr(sp+1);
    }
}

function setCookie(name, val) {
    var d = new Date();
    d.setFullYear(9999);
    document.cookie = name+"="+val+";expires="+d.toUTCString();
}

function deleteCookie(name) {
    var d = new Date();
    d.setFullYear(d.getFullYear()-1);
    document.cookie = name+"=;expires="+d.toUTCString();
}

