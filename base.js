var clist = document.getElementsByTagName("collapsible");
var ccache;
if (window.sessionStorage) {
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
                function setccache(n, v, c) {
                    ccache = ccache.substring(0, n) + v + ccache.substring(n + 1);
                    if (window.sessionStorage && c) {
                        var tmpccache = window.sessionStorage.getItem("collapcache");
                        if (!tmpccache) tmpccache = "0".repeat(clist.length);
                        tmpccache = tmpccache.substring(0, n) + v + ccache.substring(n + 1);
                        window.sessionStorage.setItem("collapcache", tmpccache);
                    }
                }
                var p = this.parentElement;
                var ccn = parseInt(p.getAttribute("ccacheno"));
                var contentlist = p.getElementsByTagName("collapcontent");
                if (ccache[ccn] == 1) {
                    setccache(ccn, "0", p.getAttribute("nocache") == null);
                    for (var n = 0; n < contentlist.length; ++n) {
                        contentlist[n].classList.add("hidden");
                    }
                } else {
                    setccache(ccn, "1", p.getAttribute("nocache") == null);
                    for (var n = 0; n < contentlist.length; ++n) {
                        contentlist[n].classList.remove("hidden");
                    }
                }
                return false;
            };
        }
        if (ccache[i] != '1') {
            for (e of elist2) {
                e.classList.add("hidden");
            }
        }
    }
}
