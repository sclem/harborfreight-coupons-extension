
function extractLinkItemNo(node) {
    var htmlRegex = new RegExp('(\\d+)\\.html$');

    var target = node.querySelector("a[href$='html']");
    var matched = target.href.match(htmlRegex);
    if (matched && matched.length > 1) {
        return matched[1];
    }
    return null;
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
