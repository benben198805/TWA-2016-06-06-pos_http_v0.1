document.write("<script language='JavaScript' src='js/show_good_list/model/item.js'></script>");
document.write("<script language='JavaScript' src='js/show_good_list/model/fixtures.js'></script>");
document.write("<script language='JavaScript' src='js/show_good_list/view/render_good_list.js'></script>");


(function ($) {
    var goodList = {};
    var cartList = {};
    var target = "";

    $.fn.show_good_list = function () {
        target = $(this);
        goodList = loadAllItems();
        renderHtml();
    };

    function renderHtml() {
        render.renderTemplate(goodList, cartList, target);
        $("div[data-role='goodList']").delegate("a[data-role='good-add-btn']", "click", function () {
            add_good_handler($(this).attr("data-barcode"));
        });
        $("div[data-role='cartList']").delegate("a[data-role='good-remove-btn']", "click", function () {
            remove_good_handler($(this).attr("data-barcode"));
        });
        $("a[data-role='cartClear").bind("click", cal_good_handler);
    }

    function formatCartList() {
        var keys = Object.keys(cartList);
        var itemList = "";
        keys.forEach(function (element) {
            for (var index = 0; index < cartList[element].count; index++) {
                itemList += cartList[element].barcode + ",";
            }
        });
        return keys.length > 0 ? itemList.substr(0, itemList.length - 1) : "";
    }
    function cal_good_handler() {
        var itemList = formatCartList();
        localStorage.itemList = itemList;
        window.location.href = "subTotal.html";
    }

    function add_good_handler(barcode) {
        if (cartList[barcode]) {
            cartList[barcode].count++;
        } else {
            var nowGood = "";
            goodList.forEach(function (element) {
                if (element.barcode == barcode) {
                    nowGood = element;
                }
            });

            cartList[barcode] = {
                barcode: barcode,
                name: nowGood.name,
                price: nowGood.price,
                unit: nowGood.unit,
                count: 1
            };
        }
        renderHtml();
    }

    function remove_good_handler(barcode) {
        var keys = Object.keys(cartList);
        if (cartList[barcode]) {
            cartList[barcode].count--;
            if (cartList[barcode].count == 0) {
                delete cartList[barcode];
            }

        }
        renderHtml();
    }
})(jQuery);

