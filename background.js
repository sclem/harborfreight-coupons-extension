chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.title || changeInfo.favIconUrl || changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, 'update');
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.action) {
            case "lookup_coupon":
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        var data = JSON.parse(this.responseText);
                        sendResponse(data);
                    }
                };
                xhr.open("GET", "https://www.hfqpdb.com/price_check/" + request.itemno);
                xhr.send();
                return true;
            default:
                break;
        }
    }
);

