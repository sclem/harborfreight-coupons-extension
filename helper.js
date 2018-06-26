function lookupCoupon(itemno, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            var data = JSON.parse(this.responseText);
            callback(data);
        }
    };
    xhr.open("GET", "https://thingproxy.freeboard.io/fetch/http://hfqpdb.com/price_check/" + itemno);
    xhr.send();
}

function findItemNo() {
    var itemno = 0;
    try {
        itemno = document.getElementsByClassName("title-infor")[0].innerText.match("\\d+")[0];
    } catch (ex) {}
    return itemno;
}

function findListItemNumber(priceboxdiv) {
    var itemno = 0;
    try {
        itemno = priceboxdiv.parentNode.querySelector('.product-ids').innerText.match("\\d+")[0];
    } catch (ex) {}
    return itemno;
}

function findWishlistItemNumber(priceboxdiv) {
    var itemno = 0;
    try {
        itemno = priceboxdiv.parentNode.parentNode.querySelector('.wishlist-sku').innerText.match("\\d+")[0];
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
