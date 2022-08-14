const addWhiteList = document.getElementById("addWhiteList")
if (addWhiteList != null) addWhiteList.addEventListener("click", addWhiteListExecute);

const saveWhiteList = document.getElementById("saveWhiteList")
if (saveWhiteList != null) saveWhiteList.addEventListener("click", saveWhiteListExecute);

function addWhiteListExecute() {
    var table = document.getElementById("whiteList") as HTMLTableElement;
    var row = table.insertRow();
    var col_length = $("#whiteList th").length;
    for(var i=0; i<col_length; i++){
        var cell = row.insertCell();
        cell.setAttribute('contentEditable', 'true');
    }
}

function saveWhiteListExecute() {
    var whiteListJson = ($('#whiteList') as any).tableToJSON();
    alert(JSON.stringify(whiteListJson[0]))
}

function setPostLinksToStorage(postLinks) {
    const map = new Map();
    for (var i = 0; i < postLinks.length; i++) {
        map.set(postLinks[i], true);
    }
    
    return map;
}

var documentOpeningTabId = null;
function documentInsertOpeningTabIdElement(tabId){
    var completeScrape = document.getElementById("iss-complete-scrape");
    if (completeScrape == null){
        completeScrape = document.createElement('p');
        completeScrape.id = "iss-complete-scrape";
        completeScrape.innerHTML = `false-${tabId}`;
        completeScrape.style.display = 'none';
        document.body.appendChild(completeScrape);
    }
    
    return completeScrape;
}

function login() {
    const baseUrl = "https://api.manto-data.com/oauth/token";
    let xml = new XMLHttpRequest();
    xml.open('POST', baseUrl, false);
    xml.setRequestHeader("Content-Type", "application/json; charset = UTF-8");
    let data = {
        client_id: "EicGnwE-lRhqAu5JP6dbOFNLQ32wS9ZmdMEPpdFIc08",
        grant_type: "password",
        email: "heo001997@gmail.com",
        password: "QyZnUPCb&ZnzpVuKePUsPY#cptr&^qhMv^tWp2!*6byFX%z!At" 
    }
    xml.send(JSON.stringify(data));
    if (xml.readyState === XMLHttpRequest.DONE && xml.status === 200) {
        return true;
    }
    return false;
}

async function getLikers() {
    let authorized = login();
    if (authorized != true){
        alert("Unauthorized!")
        return false;
    }

    const postLinksTextArea = document.getElementById("postLinksTextArea") as HTMLTextAreaElement;
    const postLinksValue = postLinksTextArea.value;

    if (postLinksValue !== ""){
        const postLinksValid = postLinksValue.split("\n").filter(function(postLink) {
            // OLD SYNTAX: ^(https?:\/\/www\.)?instagram\.com(\/p\/\w+\/?)$
            if (/^https?:\/\/www\.?instagram\.com\/p\/.*\/?$/gm.test(postLink)){
                return postLink;
            }
        });

        const postLinks = postLinksValid.map(function(link) {
            return link.trim();
        });
        
        // set executingMap which have all postLinks with true value
        // and save executingMap to local storage as JSON
        const inputExecutingMap = setPostLinksToStorage(postLinks);
        chrome.storage.local.set({ executingMap: JSON.stringify(Array.from((inputExecutingMap).entries())) }, function() {
            // console.log('executingMap value is setted from inputExecutingMap');
        });

        for (var i = 0; i < postLinks.length; i++) {
            const postLink = postLinks[i];
            var openingTabId = null;
            var openingTab = true;
            chrome.tabs.create({ url: postLink, active: true });

            chrome.tabs.onUpdated.addListener(function waitForLoadAndExecuteScript(tabId, changeInfo, tab) {
                // make sure the status is 'complete' and it's the right tab
                // also mark the tab is already run to avoid re execute the script bro
                if (tab.url.indexOf(postLink) != -1 && changeInfo.status == 'complete') {
                    openingTabId = tab.id;
                    documentOpeningTabId = tab.id;
                    // Add hidden completeScrape to confirm state of the tab
                    // If completeScrape change to id, then it's time to close the tab
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: documentInsertOpeningTabIdElement,
                        args: [documentOpeningTabId],
                    }, (response) => {
                        // console.log(response);
                    });

                    // re get the executingMap
                    chrome.storage.local.get(['executingMap'], async function(result) {
                        const outputExecutingMap = new Map(JSON.parse(result.executingMap));
                        if (outputExecutingMap.get(postLink) === true){
                            outputExecutingMap.set(postLink, false);

                            // console.log('START RE SAVING executingMap in LOCAL');
                            chrome.storage.local.set({ executingMap: JSON.stringify(Array.from((outputExecutingMap).entries())) }, function() {
                                // console.log('executingMap value is setted from outputExecutingMap');
                            });

                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ['click-liker.js']
                            });
                            chrome.tabs.onUpdated.removeListener(waitForLoadAndExecuteScript);
                        }
                    });
                }
            });

            chrome.tabs.onRemoved.addListener(function waitForRemovedTab(tabId, tabInfo) {
                // also mark the tab is already run to avoid re execute the script bro
                if (openingTabId == tabId)
                {
                    console.log("Found Instagram Tab Closed!!!");
                    openingTab = false;
                    chrome.tabs.onRemoved.removeListener(waitForRemovedTab);
                }
            });

            // THE CODE STOP HERE! Wait until the tab is closed
            while(openingTab){
                console.log("Waiting for Instagram Tab Remove!!!")
                await new Promise(r => { setTimeout(r, 500); })
            }
        }
    }
    console.log("DONE!");
}