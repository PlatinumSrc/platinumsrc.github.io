setup = function () {
    function repeatstr(s, l) {
        repeatstr_out = "";
        for (repeatstr_i = 0; repeatstr_i < l; ++repeatstr_i) {
            repeatstr_out += s;
        }
        delete repeatstr_i;
        ret = repeatstr_out;
        delete repeatstr_out;
        return ret;
    }
    if ("".trim !== void(0)) {
        function trimstr(s) {
            return s.trim();
        }
    } else {
        function trimstr(s) {
            return s.replace(/\s/g, '');
        }
    }
    function hasclass(e, c) {
        hasclass_l = e.getAttribute("class");
        if (hasclass_l === null) return false;
        hasclass_l = hasclass_l.split(' ');
        for (hasclass_i = 0; hasclass_i < hasclass_l.length; ++hasclass_i) {
            if (hasclass_l[hasclass_i] == c) return true;
        }
        delete hasclass_l;
        delete hasclass_i;
        return false;
    }
    function addclass(e, c) {
        if (e.classList !== void(0)) {
            e.classList.add(c);
        } else {
            addclass_c = e.getAttribute("class");
            if (addclass_c === null) addclass_c = "";
            else if (addclass_c != "") addclass_c += ' ';
            addclass_c += c;
            e.setAttribute("class", addclass_c);
            delete addclass_c;
        }
    }
    function removeclass(e, c) {
        if (e.classList !== void(0)) {
            e.classList.remove(c);
        } else {
            removeclass_l = e.getAttribute("class");
            if (removeclass_l === null) {delete removeclass_l; return;}
            removeclass_l = removeclass_l.split(' ');
            removeclass_c = "";
            if (removeclass_l[0] != c) removeclass_c += removeclass_l[0];
            for (removeclass_i = 1; removeclass_i < removeclass_l.length; ++removeclass_i) {
                if (removeclass_l[removeclass_i] != c) removeclass_c += ' ' + removeclass_l[removeclass_i];
            }
            delete removeclass_l;
            delete removeclass_i;
            e.setAttribute("class", removeclass_c);
            delete removeclass_c;
        }
    }
    function filterbyclass(l, c) {
        filterbyclass_l = []
        for (filterbyclass_i = 0; filterbyclass_i < l.length; ++filterbyclass_i) {
            if (hasclass(l[filterbyclass_i], c)) filterbyclass_l = filterbyclass_l.concat(l[filterbyclass_i]);
        }
        delete filterbyclass_i;
        ret = filterbyclass_l;
        delete filterbyclass_l;
        return ret;
    }
    clist = filterbyclass(document.getElementsByTagName("span"), "collapsible");
    ccache = null;
    if (window.sessionStorage !== void(0)) {
        ccache = window.sessionStorage.getItem("collapcache");
        if (ccache && ccache.length != clist.length) {
            window.sessionStorage.removeItem("collapcache");
            ccache = null;
        }
    }
    if (!ccache) ccache = repeatstr("0", clist.length);
    for (i = 0; i < clist.length; ++i) {
        c = clist[i];
        c.setAttribute("ccacheno", i);
        elist1 = filterbyclass(c.getElementsByTagName("span"), "collaptext");
        elist2 = filterbyclass(c.getElementsByTagName("span"), "collapcontent");
        hascontent = false;
        for (j = 0; j < elist2.length; ++j) {
            if (trimstr(elist2[j].innerHTML) != "") {
                hascontent = true;
                break;
            }
        }
        //console.log("hascontent: ", hascontent);
        if (hascontent) {
            for (j = 0; j < elist1.length; ++j) {
                e = elist1[j];
                addclass(e, "collapsible-link");
                e.onclick = function() {
                    //console.log("CLICK!");
                    function setccache(n, v, c) {
                        ccache = ccache.substring(0, n) + v + ccache.substring(n + 1);
                        if (window.sessionStorage !== void(0) && c) {
                            tmpccache = window.sessionStorage.getItem("collapcache");
                            if (!tmpccache) tmpccache = repeatstr("0", clist.length);
                            tmpccache = tmpccache.substring(0, n) + v + ccache.substring(n + 1);
                            window.sessionStorage.setItem("collapcache", tmpccache);
                            delete tmpccache;
                        }
                    }
                    p = this.parentElement;
                    ccn = parseInt(p.getAttribute("ccacheno"));
                    contentlist = filterbyclass(p.getElementsByTagName("span"), "collapcontent");
                    if (ccache[ccn] == 1) {
                        //console.log("  HIDE!");
                        setccache(ccn, "0", p.getAttribute("nocache") === null);
                        for (n = 0; n < contentlist.length; ++n) {
                            addclass(contentlist[n], "hidden");
                        }
                        delete n;
                    } else {
                        //console.log("  SHOW!");
                        setccache(ccn, "1", p.getAttribute("nocache") === null);
                        for (n = 0; n < contentlist.length; ++n) {
                            removeclass(contentlist[n], "hidden");
                        }
                        delete n;
                    }
                    delete p;
                    delete ccn;
                    delete contentlist;
                    return false;
                }
            }
            delete e;
            delete j;
            if (ccache[i] != '1') {
                for (j = 0; j < elist2.length; ++j) {
                    addclass(elist2[j], "hidden");
                }
                delete j;
            }
        }
    }
    delete c;
    delete elist1;
    delete elist2;
    delete hascontent;
    delete i;
    delete setup;
};
