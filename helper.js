var htmlRegex = /(?<itemno>\d+)\.html$/;

function extractLinkItemNo(node) {
    var target = node.querySelector("a[href$='html']");
    return target.href.match(htmlRegex).groups.itemno;
}

function lookupCoupon(itemno, callback) {
    chrome.runtime.sendMessage({
        action: "lookup_coupon",
        itemno: itemno
    }, function(data) {
        callback(data);
    });
}

function buildCouponLinkElement(text, url) {
    var a = document.createElement('a');
    a.href = url;
    a.innerText = text;
    a.style['display'] = 'inline-block';
    a.style['border'] = '2px dashed #308104';
    a.style['color'] = '#308104';
    a.title = 'Provided by hfqpdb.com';
    a.style['padding'] = '3px';
    a.style['align-self'] = 'flex-start';
    return a;
}
