// console.log("Ok injected file worked");
// This file is JavaScript because it was tricky to override XMLHttpRequest in TypeScript.

// Ideally we would reload the rules for each request, this helps if the rules changed.
// However, this could be expensive and will often not be necessary.
// Users will just have to refresh the tab of a site if they want to use the latest rules.
// Also, you can't access the extension storage directly in this context.

const XHR = XMLHttpRequest.prototype

const open = XHR.open
const send = XHR.send
const setRequestHeader = XHR.setRequestHeader

XHR.open = function (method, url) {
    // console.log("REACH XHR open!");
    this._url = url;
    var params = arguments[1];
    this._requestHeaders = {}
    return open.apply(this, arguments)
}

XHR.setRequestHeader = function (header, value) {
    // console.log("REACH XHR setRequestHeader!");
    this._requestHeaders[header] = value
    return setRequestHeader.apply(this, arguments)
}

XHR.send = function () {
    // console.log("REACH XHR send!");
    this.addEventListener('load', function () {
        const url = this.responseURL
        const responseHeaders = this.getAllResponseHeaders();
        try {
            if (this.getResponseHeader("content-type").indexOf("json") >= -1) {
                let responseBody;
                if (this.responseType === '' || this.responseType === 'text') {
                    responseBody = JSON.parse(this.responseText)
                } else /* if (this.responseType === 'json') */ {
                    responseBody = this.response
                }
                console.log(responseBody);
            }
        } catch (err) {
            console.debug("Error reading or processing response.", err)
        }
    })
    return send.apply(this, arguments)
}
