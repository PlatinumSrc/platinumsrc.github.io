tmpfunc = function() {

var clist = document.getElementsByTagName("collapsible");
var ccache;
if (window.localStorage) {
    ccache = window.sessionStorage.getItem("collapcache");
    if (ccache && ccache.length != clist.length) {
        window.sessionStorage.removeItem("collapcache");
        ccache = null;
    }
}
if (!ccache) ccache = "0".repeat(clist.length);
for (var i = 0; i < clist.length; ++i) {
    var c = clist[i];
    c.setAttribute("ccacheno", i);
    var elist1 = c.getElementsByTagName("collaptext");
    var elist2 = c.getElementsByTagName("collapcontent");
    var hascontent = false;
    for (e of elist2) {
        if (e.innerHTML.trim() != "") {
            hascontent = true;
            break;
        }
    }
    if (hascontent) {
        for (var j = 0; j < elist1.length; ++j) {
            var e = elist1[j];
            e.classList.add("collapsible-link");
            e.onclick = function() {
                var p = this.parentElement;
                var ccn = parseInt(p.getAttribute("ccacheno"));
                var contentlist = p.getElementsByTagName("collapcontent");
                if (contentlist[0].classList.contains("hidden")) {
                    ccache = ccache.substring(0, ccn) + "1" + ccache.substring(ccn + 1);
                    for (var n = 0; n < contentlist.length; ++n) {
                        contentlist[n].classList.remove("hidden");
                    }
                } else {
                    ccache = ccache.substring(0, ccn) + "0" + ccache.substring(ccn + 1);
                    for (var n = 0; n < contentlist.length; ++n) {
                        contentlist[n].classList.add("hidden");
                    }
                }
                if (p.getAttribute("nocache") == null) window.sessionStorage.setItem("collapcache", ccache);
            };
        }
        if (ccache[i] != '1') {
            for (e of elist2) {
                e.classList.add("hidden");
            }
        }
    } else {
        for (e of elist1) {
            e.classList.add("collapsible-empty");
        }
    }
}

}; tmpfunc(); delete tmpfunc;
