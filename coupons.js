function handleSingleItemPage(priceboxdiv) {
    let itemno = findSingleItemNo();

    let saleCSS = false;
    if (priceboxdiv) {
        let salebox = priceboxdiv.querySelector('.sale');
        if (salebox) {
            saleCSS = true;
            priceboxdiv = salebox;
        }
    }

    if (itemno) {
        lookupCoupon(itemno, function(resp) {
            let couponTitleText = document.createElement('span');
            couponTitleText.style['display'] = 'inline-block';
            couponTitleText.style['vertical-align'] = 'top';
            couponTitleText.style['color'] = '#3a3a3a';
            couponTitleText.style['vertical-align'] = 'top';
            let margin = '5px 5px 0 10px';
            let fontSize = '1.3em';
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
                priceboxdiv.appendChild(couponTitleText, priceboxdiv.querySelector('.comp'));
            }

            if (resp.hasOwnProperty('bestPrice')) {
                let couponLinkText = '$' + resp.bestPrice;
                if (~(resp.bestPrice + '').toLowerCase().indexOf('free')) {
                    couponLinkText = 'FREE';
                }
                couponTitleText.innerText = 'Best Coupon:';

                let couponLink = buildCouponLinkElement(couponLinkText, resp.url);
                couponLink.style['padding-left'] = '3px';
                couponLink.style['padding-right'] = '3px';
                couponLink.style['position'] = 'absolute';
                couponLink.innerText = couponLinkText;
                if (saleCSS) {
                    priceboxdiv.appendChild(couponLink);
                } else {
                    couponLink.style['font-size'] = '2.5em';
                    priceboxdiv.appendChild(couponLink, priceboxdiv.querySelector('.comp'));
                }
            }
        });
    }
}

function displayCoupons() {
    let priceboxdivs = document.body.querySelectorAll('.price-box');

    if (!priceboxdivs.length) {
        priceboxdivs = document.body.querySelectorAll("div[class^='price__info']");
    }

    if (!priceboxdivs) {
        return;
    }

    //try single product page
    if (priceboxdivs.length === 1) {
        handleSingleItemPage(priceboxdivs[0]);
    }

    //continue anyway
    priceboxdivs.forEach(function(item) {
        let itemno = 0;
        let wishlist = false;
        if (~window.location.pathname.indexOf('wishlist')) {
            wishlist = true;
            itemno = findWishlistItemNumber(item);
        } else {
            itemno = findListItemNumber(item);
        }

        if (itemno) {
            lookupCoupon(itemno, function(resp) {
                if (resp.hasOwnProperty('bestPrice')) {
                    let couponLinkText = '$' + resp.bestPrice;
                    if (~(resp.bestPrice + '').toLowerCase().indexOf('free')) {
                        couponLinkText = 'FREE';
                    }
                    let couponLink = buildCouponLinkElement(couponLinkText, resp.url);

                    couponLink.style['padding'] = '2px';
                    couponLink.style['margin-top'] = '5px';
                    couponLink.style['margin-right'] = '2px';
                    couponLink.style['font-size'] = '1.3em';
                    if (!wishlist) {
                        couponLink.style['float'] = 'right';
                    }

                    let insertNode = item.querySelector('.clear');
                    if (!insertNode) {
                        insertNode = item.querySelector('.comp');
                    }
                    item.insertBefore(couponLink, insertNode);
                }
            });
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    if (request.action === 'new_item') {
        displayCoupons();
    }
});

displayCoupons();
