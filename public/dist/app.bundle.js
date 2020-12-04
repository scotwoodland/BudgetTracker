!(function (e) {
  var t = {};
  function n(o) {
    if (t[o]) return t[o].exports;
    var r = (t[o] = { i: o, l: !1, exports: {} });
    return e[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, o) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var r in e)
          n.d(
            o,
            r,
            function (t) {
              return e[t];
            }.bind(null, r)
          );
      return o;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 0));
})([
  function (e, t) {
    let n,
      o = [];
    function r(e, t, n, o) {
      return new Promise((r, a) => {
        const c = window.indexedDB.open(e);
        let u, l, i;
        (c.onupgradeneeded = function (e) {
          c.result.createObjectStore(t, { autoIncrement: !0 });
        }),
          (c.onerror = function (e) {
            console.log("There was an error");
          }),
          (c.onsuccess = function (e) {
            if (
              ((u = c.result),
              (l = u.transaction(t, "readwrite")),
              (i = l.objectStore(t)),
              (u.onerror = function (e) {
                console.log("error");
              }),
              "add" === n && i.add(o),
              "get" === n)
            ) {
              const e = i.getAll();
              e.onsuccess = function () {
                r(e.result);
              };
            }
            "clear" === n && i.clear(),
              (l.oncomplete = function () {
                u.close();
              });
          });
      });
    }
    function a() {
      let e = o.reduce((e, t) => e + parseInt(t.value), 0);
      document.querySelector("#total").textContent = e;
    }
    function c() {
      let e = document.querySelector("#tbody");
      (e.innerHTML = ""),
        o.forEach((t) => {
          let n = document.createElement("tr");
          (n.innerHTML = `\n      <td>${t.name}</td>\n      <td>${t.value}</td>\n    `),
            e.appendChild(n);
        });
    }
    function u() {
      let e = o.slice().reverse(),
        t = 0,
        r = e.map((e) => {
          let t = new Date(e.date);
          return `${t.getMonth() + 1}/${t.getDate()}/${t.getFullYear()}`;
        }),
        a = e.map((e) => ((t += parseInt(e.value)), t));
      n && n.destroy();
      let c = document.getElementById("myChart").getContext("2d");
      n = new Chart(c, {
        type: "line",
        data: {
          labels: r,
          datasets: [
            {
              label: "Total Over Time",
              fill: !0,
              backgroundColor: "#6666ff",
              data: a,
            },
          ],
        },
      });
    }
    function l(e) {
      let t = document.querySelector("#t-name"),
        n = document.querySelector("#t-amount"),
        l = document.querySelector(".form .error");
      if ("" === t.value || "" === n.value)
        return void (l.textContent = "Missing Information");
      l.textContent = "";
      let i = { name: t.value, value: n.value, date: new Date().toISOString() };
      e || (i.value *= -1),
        o.unshift(i),
        u(),
        c(),
        a(),
        fetch("/api/transaction", {
          method: "POST",
          body: JSON.stringify(i),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((e) => e.json())
          .then((e) => {
            e.errors
              ? (l.textContent = "Missing Information")
              : ((t.value = ""), (n.value = ""));
          })
          .catch((e) => {
            r("budgets", "trasactStore", "add", i),
              (t.value = ""),
              (n.value = "");
          });
    }
    r("budgets", "trasactStore", "get").then((e) => {
      console.log(e),
        e.length > 0 &&
          (fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(e),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
          }).then((e) => e.json()),
          r("budgets", "trasactStore", "clear"));
    }),
      fetch("/api/transaction")
        .then((e) => e.json())
        .then((e) => {
          (o = e), a(), c(), u();
        }),
      (document.querySelector("#add-btn").onclick = function () {
        l(!0);
      }),
      (document.querySelector("#sub-btn").onclick = function () {
        l(!1);
      });
  },
]);
