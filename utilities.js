
function $(id) {
    return document.getElementById(id);
}

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

function rgbAlpha(rgb, a) {
    return 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+a+')';
}

function rgbSolid(rgb) {
    return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
}

function getWidth(el) {
    var rw = getComputedStyle(el).width;
    return parseInt(rw.substr(0, rw.length-2))+NODEPADDING;
}

function getHeight(el) {
    var rh = getComputedStyle(el).height;
    return parseInt(rh.substr(0, rh.length-2))+NODEPADDING;
}

