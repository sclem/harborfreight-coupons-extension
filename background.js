chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === 'lookup_coupon') {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    var data = JSON.parse(this.responseText);
                    sendResponse(data);
                }
            };
            xhr.open("GET", "https://www.hfqpdb.com/price_check/" + request.itemno);
            xhr.send();
            return true;
        }
    }
);

chrome.webNavigation['onHistoryStateUpdated'].addListener(function (data) {
    if (typeof data) {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
            },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'new_item'});
            }
        );
    }
});
