document.write("<script language='JavaScript' src='/js/cal/main.js'></script>");

(function ($) {
    var itemList = localStorage.itemList;
    var items = [];
    var itemArr = itemList.split(",");
    itemArr.forEach(function (element) {
        items.push(element);
    });

    var result = printInventory(items);


    document.write(result);

})(jQuery);