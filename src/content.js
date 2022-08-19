const unique = require("uniq");
const _ = require("lodash");
const fs = require('fs');
const { Tabletojson: tabletojson } = require('tabletojson');

try
{
    console.log("Ok contents.js worked");
    console.log(_.range(1,9));

    global.window.tabletojson = tabletojson;
    window.tabletojson = tabletojson;

    debugger;

    const contentScriptSrcs = [
        "scripts/jquery-3.6.0.min.js",
        "scripts/jquery.tabletojson.min.js",
        "injected.js"
    ];

    contentScriptSrcs.forEach(path => {
        const s = document.createElement('script');
        s.src = chrome.runtime.getURL(path);
        s.onload = async function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    })

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        // use `url` here inside the callback because it's asynchronous!
    });
}
catch (exception)
{
    // console.log("Ok contents.js worked");
}
