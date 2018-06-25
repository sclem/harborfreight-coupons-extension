function findItemNo() {
    var itemno = 0;
    try {
        itemno = document.getElementsByClassName("title-infor")[0].innerText.toLowerCase().split("item#")[1];
    } catch (ex) {}
    return itemno;
}

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

var itemno = findItemNo();

var priceboxdiv = document.body.querySelector('.price-box');
var saleCSS = false;

if (priceboxdiv) {
    var salebox = priceboxdiv.querySelector('.sale');
    if (salebox) {
        saleCSS = true;
        priceboxdiv = salebox;
    }
}

if (itemno) {
    lookupCoupon(itemno, function(resp) {
        var couponTitleText = document.createElement('span');
        couponTitleText.style['display'] = 'inline-block';
        couponTitleText.style['vertical-align'] = 'top';
        couponTitleText.style['color'] = '#3a3a3a';
        couponTitleText.style['vertical-align'] = 'top';
        var margin = '5px 5px 0 10px';
        var fontSize = '1.3em';
        if (saleCSS) {
            margin = '-3px 5px 0 5px';
            fontSize = '0.6em';
        }
        couponTitleText.style['margin'] = margin;
        couponTitleText.style['font-size'] = fontSize;
        couponTitleText.title = 'Provided by hfqpdb.com';
        couponTitleText.innerText = resp.error || '';
        if (saleCSS) {
            priceboxdiv.appendChild(couponTitleText);
        } else {
            priceboxdiv.insertBefore(couponTitleText, priceboxdiv.querySelector('.comp'));
        }

        if (resp.hasOwnProperty('bestPrice')) {
            var couponLinkText = '$' + resp.bestPrice;
            if (~(resp.bestPrice + '').toLowerCase().indexOf('free')) {
                couponLinkText = 'FREE';
            }
            couponTitleText.innerText = 'Best Coupon:';

            var couponLink = document.createElement('a');
            couponLink.href = resp.url;
            couponLink.style['border'] = '2px dashed #308104';
            couponLink.style['display'] = 'inline-block';
            couponLink.style['color'] = '#308104';
            couponLink.style['padding-left'] = '3px';
            couponLink.style['padding-right'] = '3px';
            couponLink.style['position'] = 'absolute';
            couponLink.innerText = couponLinkText;
            couponLink.title = 'Provided by hfqpdb.com';
            if (saleCSS) {
                priceboxdiv.appendChild(couponLink);
            } else {
                couponLink.style['font-size'] = '2.5em';
                priceboxdiv.insertBefore(couponLink, priceboxdiv.querySelector('.comp'));
            }
        }
    });
}
