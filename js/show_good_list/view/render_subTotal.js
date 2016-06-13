var renderSubTotal = {
    loadTemplate: function () {
        var subTotalTitle = _.template("<div/><p><没钱赚商店>购物清单</p><p><%- time%></p></div>");

        var subTotalList = _.template("<div><ul class='list-group'><% _.forEach(billItems,function(item){%><li class='list-group-item'><%- item.name%>:<%- item.count%> 单价：<%- item.price.toFixed(2)%>per<%- item.unit%>  小计：<%- item.subtotal.toFixed(2)%></li><%})%></ul></div>");

        var subTotalPomotionTitle = _.template("<div><p>挥泪赠送商品：</p></div>");

        var subTotalPromotionList = _.template("<div><ul class='list-group'><% _.forEach(freeItems,function(item){%><li class='list-group-item'>名称：<%- element.name%>，数量：<%- element.freeCount%><%- element.unit%></li><%})%></ul></div>");

        var subTotalSum = _.template("<div><p>总计：<%- total.toFixed(2)%></p><p>节省：<%- freeTotal.toFixed(2)%></p></div>");

        return {
            subTotalTitle: subTotalTitle,
            subTotalList: subTotalList,
            subTotalPomotionTitle: subTotalPomotionTitle,
            subTotalPromotionList: subTotalPromotionList,
            subTotalSum: subTotalSum
        }
    },
    renderTemplate: function (receipt,targetDom) {
        var template = this.loadTemplate();
        var html = "";

        var subTotalTitleHtml = template.subTotalTitle({ time: getDateString() });
        var subTotalListHtml = template.subTotalList({ billItems: receipt.billItems });
        var subTotalPomotionTitleHtml = template.subTotalPomotionTitle();
        var subTotalPromotionListHtml = template.subTotalPromotionList({ freeItems: receipt.freeItems });
        var subTotalSumHtml = template.subTotalSum({ total: receipt.total, freeTotal: receipt.freeTotal });

        html = subTotalTitleHtml + subTotalListHtml + subTotalPomotionTitleHtml + subTotalPromotionListHtml + subTotalSumHtml;
        targetDom.html(html);
    }
}