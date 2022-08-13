import * as url from "url";

chrome.runtime.onInstalled.addListener(async () => {
    // console.log("installed");
});

// action on extension icon
chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
});

chrome.contextMenus.create({
    id: "protocol-swapper",
    title: "https <-> http",
    contexts: [ "all" ],
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "protocol-swapper") {
        var redirectUrl;
        if (info.pageUrl.substring(0,5) == "https"){
            redirectUrl = info.pageUrl.slice(0,4) + info.pageUrl.slice(4+1);
        } else {
            redirectUrl = info.pageUrl.slice(0,4) + "s:" + info.pageUrl.slice(4+1);
        }
        chrome.tabs.update({url: redirectUrl});
    }
});

chrome.runtime.onMessage.addListener((request, sender, resp) => {
    // if (request == "open-new-tab"){
    //     chrome.tabs.create({url: 'NEW URL'}, (tab) => {
    //         setTimeout(() => {
    //             //use your message data here.
    //             chrome.tabs.executeScript(tab.id, {code: "document.title = message.title"})
    //         }, 3000);
    //     })
    // }

    // console.log("request", request);
    // console.log("sender", sender);
    // console.log("response", resp("yeah messeage received in background mess!!! callback to content-mess bro!!!"));
});