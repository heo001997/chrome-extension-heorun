try
{
    console.log("Ok contents.js worked");
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('injected.js');
    s.onload = async function () {
        (this as any).remove()
    };
    (document.head || document.documentElement).appendChild(s);



    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        // use `url` here inside the callback because it's asynchronous!
    });
}
catch (exception)
{
    // console.log("Ok contents.js worked");
}
