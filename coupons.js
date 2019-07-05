function renderCoupon(itemno, priceboxdiv, renderType) {
    if (!priceboxdiv) {
        console.error('no price box div to render');
        return;
    }
    if (itemno) {
        lookupCoupon(itemno, function(resp) {
            var wrapper = document.createElement('div');
            wrapper.style['display'] = 'flex';
            wrapper.style['justify-content'] = 'space-between';
            wrapper.style['margin-top'] = '5px';
            switch (renderType) {
                case 'wishlist':
                    break;
                case 'list':
                    break;
                default:
                    wrapper.style['margin-top'] = '12px';
                    wrapper.style['margin-left'] = '8px';
                    break;
            }

            var couponTitleText = document.createElement('span');
            couponTitleText.title = 'Provided by hfqpdb.com';
            couponTitleText.style['display'] = 'inline-block';
            couponTitleText.style['color'] = '#3a3a3a';

            switch (renderType) {
                case 'wishlist':
                    break;
                case 'list':
                    couponTitleText.style['font-size'] = '0.5em';
                    break;
                default:
                    couponTitleText.style['margin-right'] = '8px';
                    break;
            }

            couponTitleText.innerText = resp.error || '';
            wrapper.appendChild(couponTitleText);

            if (resp.hasOwnProperty('bestPrice')) {
                var couponLinkText = '$' + resp.bestPrice;
                if (~(resp.bestPrice + '').toLowerCase().indexOf('free')) {
                    couponLinkText = 'FREE';
                }
                couponTitleText.innerText = 'Best Coupon:';

                var couponLink = buildCouponLinkElement(couponLinkText, resp.url);
                switch (renderType) {
                    case 'wishlist':
                        couponLink.style['font-size'] = '1.3em';
                        break;
                    case 'list':
                        couponLink.style['font-size'] = '0.8em';
                        break;
                    default:
                        couponLink.style['font-size'] = '2em';
                        break;
                }
                couponLink.innerText = couponLinkText;
                wrapper.appendChild(couponLink);
            }
            priceboxdiv.appendChild(wrapper);
        });
    }
}

function getReviewItemNo() {
    var reviewlink = document.body.querySelector('a[href^="/reviews/write?reviewsku"]');
    if (reviewlink) {
        return reviewlink.href.match('[0-9].+')[0];
    }
    return 0;
}

function displayCoupons(action) {
    switch (action) {
        case 'update':
            // attempt single page first
            var itemno = getReviewItemNo();
            if (itemno) {
                var priceboxdiv = document.querySelector("div[class^='price__info']");
                //render to price box child
                renderCoupon(itemno, priceboxdiv.children[0]);
                return;
            }

            // assume grid
            var priceboxdivs = document.body.querySelectorAll("p[class^='grid__price']");
            if (priceboxdivs.length) {
                priceboxdivs.forEach(function(item) {
                    try {
                        var itemno = extractLinkItemNo(item.parentNode.parentNode.parentNode);
                        renderCoupon(itemno, item, 'list');
                    } catch (ex) {
                        console.error('error detecting item number/rendering list coupon: ', ex);
                    }
                });
                return;
            }

            // final attempt, check wishlist
            var wishlist = document.body.querySelector("form[id='wishlist-view-form']");
            if (wishlist) {
                var items = wishlist.querySelectorAll("tr[id^='item']");
                items.forEach(function (item) {
                    try {
                        var itemno = extractLinkItemNo(item);
                        renderCoupon(itemno, item.children[2].children[0], 'wishlist');
                    } catch (ex) {
                        console.error('error detecting item number/rendering wishlist coupon: ', ex);
                    }
                });
            }
            break;
        default:
            console.log('unknown message received from background page: ', action);
            break;
    }
};

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

chrome.runtime.onMessage.addListener(debounce(displayCoupons, 500));
