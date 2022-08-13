processAction();

// Will always click random in coordinates
// Events name:
// "mousedown"
// "mouseup"

async function processAction(){
    // console.log("PROCESS ACTION HAS BEEN RUN!");
    const buttonLiker = getShowLikerButton() as HTMLAnchorElement;
    // console.log(buttonLiker);

    // only run if it is photo
    if (buttonLiker !== null){
        // HAVE TO SLEEP FOR 2s BECAUSE IF WE IGNITE IT TOO SOON, THE WINDOW GONNA DISSAPPERED
        // IG bugs :)))
        await new Promise(r => { setTimeout(r, 2000); })
        realMouseEvent (buttonLiker, "click");

        // Retry after each 100ms to make sure firstUserFullName != null
        // Make sure the liker list is loaded 100%
        let firstUserFullName = null;
        while(firstUserFullName == null){
            try
            {
                firstUserFullName = document.querySelector('[aria-label="Likes"]').childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1] as HTMLDivElement;
                realMouseEvent (firstUserFullName, "click");
            }
            catch (error)
            {
                await new Promise(r => { setTimeout(r, 100); })
                // console.log(error);
            }
        }

        addExportUserButtonAndNumber();
        buttonLiker.addEventListener("click", addExportUserButtonAndNumber); // Everytime when button Liker pressed, it will addExportUserButton if it not exist

        // Retry after each 100ms to make sure firstUserFullName != null
        let scrollableElement = null;
        while(scrollableElement == null){
            try
            {
                scrollableElement = document.querySelectorAll('[aria-label="Likes"]')[0].childNodes[0].childNodes[1].childNodes[0] as HTMLDivElement;
            }
            catch (error)
            {
                await new Promise(r => { setTimeout(r, 100); })
                // console.log(error);
            }
        }
        
        // GET Coor of scrollableElement, to scroll correctly effective
        const scrollableElementCoor = scrollableElement.getBoundingClientRect();
        const scrollableElementCoorX = scrollableElementCoor.x + scrollableElementCoor.width;

        // Scrolling down and up by mouse
        while(true){
            var completeScrape = document.getElementById("iss-complete-scrape");
            if (completeScrape != null){
                if (completeScrape.innerHTML.split("-")[0] == "true"){
                    var tabId = completeScrape.innerHTML.split("-")[1];
                    exportUser();
                    window.close();
                }
                else if (completeScrape.innerHTML.split("-")[0] == "limited"){
                    var tabId = completeScrape.innerHTML.split("-")[1];
                    exportUser();
                    alert("LIMIT REACHED!!! PLEASE CLOSE TOOL AND THIS TAB!!!")
                    await new Promise(r => { setTimeout(r, 1000); })
                }
            }

            var exportUserNumber = parseInt(document.getElementById("exportUserNumber").innerHTML);
            var exportUserNumberNew = exportUserNumber;

            while(exportUserNumber === exportUserNumberNew){
                scrollableElement.scroll(randomIntFromInterval(scrollableElementCoorX, scrollableElementCoorX + 10), randomIntFromInterval(1, 10));
                await new Promise(r => { setTimeout(r, randomIntFromInterval(100, 500)); })
                scrollableElement.scroll(randomIntFromInterval(scrollableElementCoorX, scrollableElementCoorX + 10), randomIntFromInterval(900000, 999999));
                await new Promise(r => { setTimeout(r, randomIntFromInterval(100, 500)); })
                scrollableElement.scroll(randomIntFromInterval(scrollableElementCoorX, scrollableElementCoorX + 10), randomIntFromInterval(90000000, 99999999));
                await new Promise(r => { setTimeout(r, randomIntFromInterval(100, 500)); })
                exportUserNumberNew = parseInt(document.getElementById("exportUserNumber").innerHTML);
            }
            await new Promise(r => { setTimeout(r, randomIntFromInterval(18000, 20000)); })
        }
    }
}

async function addExportUserButtonAndNumber(){
    if (document.getElementById("exportUserButton") == null){
        let likesLabel = null;
        while(likesLabel == null){
            try
            {
                likesLabel = (document.querySelector('[aria-label="Likes"]') as HTMLDivElement).childNodes[0].childNodes[0].childNodes[0].childNodes[1] as HTMLDivElement;
                const exportUserButton = document.createElement("button");
                exportUserButton.id = "exportUserButton";
                exportUserButton.textContent = "Export";
                exportUserButton.style.margin = "10px 0px 10px 0px";
                exportUserButton.addEventListener("click", exportUser);
                insertAfter(exportUserButton, likesLabel);
            }
            catch (error)
            {
                await new Promise(r => { setTimeout(r, 100); })
                // console.log(error);
            }
        }

        addExportUserNumber();
    }
}

async function addExportUserNumber(){
    if (document.getElementById("exportUserNumber") == null){
        const exportUserButton = document.getElementById("exportUserButton");
        const exportUserNumberHidden = document.getElementById("iss-usernames-number");
        const exportUserNumber = document.createElement("p");
        exportUserNumber.id = "exportUserNumber";

        if (exportUserNumberHidden == null){
            exportUserNumber.textContent = "0";
        }else{
            exportUserNumber.textContent = exportUserNumberHidden.innerHTML;
        }
        
        exportUserNumber.style.margin = "13px 5px";
        insertAfter(exportUserNumber, exportUserButton);
    }
}

function exportUser(){
    var usernames = document.getElementById("iss-usernames").innerHTML;
    usernames = usernames.substring(1);
    var filename = document.URL.split("\/p\/")[1].slice(0, -1);
    downloadString(usernames, "text/csv", `${filename}-usernames.csv`)
    // console.log("Usernames Exported!!!!!")
}

function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType });
  
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}
  
function realMouseEvent (element, eventName) {
    const elementCoor = element.getBoundingClientRect();

    var minX = 0;
    var maxX = elementCoor.width;
    var minY = 0;
    var maxY = elementCoor.height;
    
    const coordX = Math.floor( elementCoor.x ) + Math.floor(Math.random() * ( maxX - minX ) + minX);
    // console.log("x: " + coordX);
    const coordY = Math.floor( elementCoor.y ) + Math.floor(Math.random() * ( maxY - minY ) + minY);
    // console.log("y: " + coordY);

    // console.log(`document.elementFromPoint(${coordX}, ${coordY}).click();`);
    var elementSelected = document.elementFromPoint(coordX, coordY) as HTMLElement;

    const result = elementSelected.dispatchEvent(new MouseEvent(eventName, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: coordX,
        clientY: coordY,
        button: 0
    }));

    elementSelected.focus();

    // console.log(result);
};



function getShowLikerButton() {
    const articles = document.getElementsByTagName("article");
    const articleParts = articles[articles.length - 1].childNodes;
    const postPart = articleParts[2] as HTMLDivElement;
    const postPartVideo = postPart.getElementsByTagName("video");

    if (postPartVideo.length === 0){
        // console.log("Post detected! Start finding show liker button!");

        const likePart = articleParts[articleParts.length - 1];
        const likeSection = likePart.childNodes[1].childNodes[0];
        const likeLineRaw = likeSection.childNodes;
        const likeLine = likeSection.childNodes[likeLineRaw.length - 1];
        const likeArchors = likeLine.childNodes;

        for (var j = 0; j < likeArchors.length; j++) {
            var archorName = likeArchors[j].nodeName.toLowerCase();
            if (archorName === "a"){
                return likeArchors[j];
            }
        }
    }
    else
    {
        console.log("Doesn't support crawl for post Video type!!!");
        return null;
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  