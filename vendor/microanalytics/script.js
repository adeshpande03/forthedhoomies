!(function (t) {
  "use strict";
  function e(e, r) {
    var n = document.getElementById("ZwSg9rf6GA");
    if ("true" === n.getAttribute("data-dnt") && navigator.doNotTrack)
      return !1;
    var a = {};
    (a.referrer = r || t.document.referrer),
      (a.page = t.location.href.replace(/#.+$/, "")),
      (a.screen_resolution = screen.width + "x" + screen.height),
      e && (a.event = e);
    var o = new XMLHttpRequest();
    o.open("POST", n.getAttribute("data-host") + "/api/event", !0),
      o.setRequestHeader(
        "Content-Type",
        "application/json, text/javascript; charset=utf-8"
      ),
      o.send(JSON.stringify(a));
  }
  try {
    var r = history.pushState;
    (history.pushState = function () {
      var n = t.location.href.replace(/#.+$/, "");
      r.apply(history, arguments), e(null, n);
    }),
      (t.onpopstate = function (t) {
        e(null);
      }),
      (t.pa = {}),
      (t.pa.track = e),
      e(null);
  } catch (t) {
    console.log(t.message);
  }
})(window);
