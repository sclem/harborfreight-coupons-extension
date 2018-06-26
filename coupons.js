function handleSingleItemPage(priceboxdiv) {
    var itemno = findItemNo();

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

                var couponLink = buildCouponLinkElement(couponLinkText, resp.url);
                couponLink.style['padding-left'] = '3px';
                couponLink.style['padding-right'] = '3px';
                couponLink.style['position'] = 'absolute';
                couponLink.innerText = couponLinkText;
                if (saleCSS) {
                    priceboxdiv.appendChild(couponLink);
                } else {
                    couponLink.style['font-size'] = '2.5em';
                    priceboxdiv.insertBefore(couponLink, priceboxdiv.querySelector('.comp'));
                }
            }
        });
    }
}

function displayCoupons() {
    var priceboxdivs = document.body.querySelectorAll('.price-box');

    if (!priceboxdivs) {
        return;
    }

    if (priceboxdivs.length === 1) {
        handleSingleItemPage(priceboxdivs[0]);
        return;
    } else {
        priceboxdivs.forEach(function(item) {
            var itemno = 0;
            var wishlist = false;
            if (~window.location.pathname.indexOf('wishlist')) {
                wishlist = true;
                itemno = findWishlistItemNumber(item);
            } else {
                itemno = findListItemNumber(item);
            }

            if (itemno) {
                lookupCoupon(itemno, function(resp) {
                    if (resp.hasOwnProperty('bestPrice')) {
                        var couponLinkText = '$' + resp.bestPrice;
                        if (~(resp.bestPrice + '').toLowerCase().indexOf('free')) {
                            couponLinkText = 'FREE';
                        }
                        var couponLink = buildCouponLinkElement(couponLinkText, resp.url);

                        couponLink.style['padding'] = '2px';
                        couponLink.style['margin-top'] = '5px';
                        couponLink.style['margin-right'] = '2px';
                        couponLink.style['font-size'] = '1.3em';
                        if (!wishlist) {
                            couponLink.style['float'] = 'right';
                        }

                        var insertNode = item.querySelector('.clear');
                        if (!insertNode) {
                            insertNode = item.querySelector('.comp');
                        }
                        item.insertBefore(couponLink, insertNode);
                    }
                });
            }
        });
    }
}

displayCoupons();
