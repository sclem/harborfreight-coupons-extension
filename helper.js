var itemRegex = /\d+/g;

String.prototype.matchAll = function(regexp) {
    var matches = [];
    this.replace(regexp, function() {
        var arr = ([]).slice.call(arguments, 0);
        var extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr);
    });
    return matches.length ? matches : null;
};

function lookupCoupon(itemno, callback) {
    chrome.runtime.sendMessage({
        action: "lookup_coupon",
        itemno: itemno
    }, function(data) {
        callback(data);
    });
}

function findSingleItemNo() {
    var itemno = 0;
    var matches = [];
    try {
        matches = document.body.innerHTML.match(/\"sku\"\:\"(\d+)\"/);;
        itemno = matches.length ? matches[1] : document.getElementsByClassName("title-infor")[0].innerText.matchAll(itemRegex).pop();;
    } catch (ex) {
        // shrug
    }
    return itemno;
}

function findListItemNumber(priceboxdiv) {
    var itemno = 0;
    try {
        itemno = priceboxdiv.parentNode.querySelector('.product-ids').innerText.matchAll(itemRegex).pop();
    } catch (ex) {}
    return itemno;
}

function findWishlistItemNumber(priceboxdiv) {
    var itemno = 0;
    try {
        itemno = priceboxdiv.parentNode.parentNode.querySelector('.wishlist-sku').innerText.matchAll(itemRegex).pop();
    } catch (ex) {}
    return itemno;
}

function buildCouponLinkElement(text, url) {
    var a = document.createElement('a');
    a.href = url;
    a.innerText = text;
    a.style['display'] = 'inline-block';
    a.style['border'] = '2px dashed #308104';
    a.style['color'] = '#308104';
    a.title = 'Provided by hfqpdb.com';
    return a;
}
