document.write("<script language='JavaScript' src='/js/show_good_list/subTotal.js'></script>");

(function ($) {
    
    var itemList = localStorage.itemList;
    var items = [];
    var itemArr = itemList.split(",");
    itemArr.forEach(function (element) {
        items.push(element);
    });

    var receipt = printInventoryWithData(items);
    
    
    $("div[data-role='store']").show_subTotal(receipt);
})(jQuery);