var render = {
    loadTemplate: function () {
        var goodListTemplate = _.template("<div class='col-md-7' data-role='goodList'><h3>Shopping List</h3><ul class='list-group'><% _.forEach(allItems,function(item){%><li class='list-group-item'><%- item.name%>:<%- item.price%> per <%- item.unit%><a href='javascript:' data-barcode='<%- item.barcode%>' data-role='good-add-btn' class='glyphicon glyphicon-plus pull-right'></a></li><%})%></ul></div>");

        var cartListTemplate = _.template("<div class='col-md-5' data-role='cartList'><h3>Cart List</h3><ul class='list-group'><% _.forEach(cartItems,function(item){%><li class='list-group-item'><%- item.name%>:<%- item.count%> <%- item.unit%><a href='javascript:' data-barcode='<%- item.barcode%>' data-role='good-remove-btn' class='glyphicon glyphicon-minus pull-right'></a></li><%})%></ul><a class='btn btn-primary' data-role='cartClear' role='button'>Clearing</a></div>");

        return {
            goodListTemplate: goodListTemplate,
            cartListTemplate: cartListTemplate
        }
    },
    renderTemplate: function (goodList, cartList, targetDom) {
        var template = this.loadTemplate();
        var html = "";

        var goodListHtml = template.goodListTemplate({ allItems: goodList });
        var cartLIstHtml = template.cartListTemplate({ cartItems: cartList });

        html = goodListHtml + cartLIstHtml;
        targetDom.html(html);
    }
}