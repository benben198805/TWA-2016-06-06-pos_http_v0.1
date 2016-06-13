document.write("<script language='JavaScript' src='js/show_good_list/view/render_subTotal.js'></script>");

(function ($) {
    $.fn.show_subTotal = function (receipt) {
        renderSubTotal.renderTemplate(receipt,$(this));
    };
})(jQuery);

