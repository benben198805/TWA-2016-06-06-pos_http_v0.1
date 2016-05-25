//TODO: Please write code in this file.
function decodeBarcode(inputs) {
    var decodeInputs = [];
    inputs.forEach(function (element) {
        if (element.indexOf("-") > 0) {
            var tempArr = element.split('-');
            var num = parseInt(tempArr[1]) || 0;
            for (var i = 0; i < num; i++) {
                decodeInputs.push(tempArr[0]);
            }
        } else {
            decodeInputs.push(element);
        }
    });
    return decodeInputs;
}

function mergeInpus(decodeInputs, allItems) {
    var preCartItem = [];
    decodeInputs.forEach(function (element) {
        var existItem = allItems.find(function (item) {
            return item.barcode === element;
        });
        preCartItem.push(existItem);
    });
    return preCartItem;
}

function transferCartItems(preCartItems) {
    var cartItems = [];
    preCartItems.forEach(function (element) {
        if (cartItems[element.barcode]) {
            cartItems[element.barcode].count++;
        } else {
            cartItems[element.barcode] = element;
            cartItems[element.barcode].count = 1;
        }
    });

    var cartItemsArray = [];
    var keys = Object.keys(cartItems);
    keys.forEach(function (key) {
        cartItemsArray.push(cartItems[key]);
    });

    return cartItemsArray;
}

function caculateFreeCount(cartItems, promotionItems) {
    var keys = Object.keys(cartItems);
    keys.forEach(function (element) {
        if (promotionItems[0].barcodes.indexOf(cartItems[element].barcode) > 0) {
            cartItems[element].freeCount = Math.floor(cartItems[element].count / 3);
        } else {
            cartItems[element].freeCount = 0;
        }
    });
    return cartItems;
}

function caculateSubtotal(finalCartItems) {
    return finalCartItems.map(function (element) {
        return Object.assign({
            freeSubtotal:element.price * element.freeCount,
            subtotal:element.price * (element.count - element.freeCount)
        },element);
    });
}

function caculateFreeTotal(billItems) {
    return billItems.reduce(function (a, b) {
        return {
            freeSubtotal: a.freeSubtotal + b.freeSubtotal
        };
    }).freeSubtotal;
}

function caculateTotal(billItems) {
    return billItems.reduce(function (a, b) {
        return {
            subtotal: a.subtotal + b.subtotal
        };
    }).subtotal;
}

function getFreeItem(billItems) {
    return billItems.filter(function (element) {
        return element.freeCount != 0;
    });
}

function dateDigitToString(num) {
    return num < 10 ? '0' + num : num;
};

function getDateString() {
    var currentDate = new Date(),
        year = dateDigitToString(currentDate.getFullYear()),
        month = dateDigitToString(currentDate.getMonth() + 1),
        date = dateDigitToString(currentDate.getDate()),
        hour = dateDigitToString(currentDate.getHours()),
        minute = dateDigitToString(currentDate.getMinutes()),
        second = dateDigitToString(currentDate.getSeconds()),
        formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;
    return formattedDateString;
}

function printReceipt(billItems, freeItems, freeTotal, total) {
    var result = '***<没钱赚商店>购物清单***\n' +
        '打印时间：' + getDateString() + '\n' +
        '----------------------\n';
    billItems.forEach(function (element) {
        result += `名称：${element.name}，数量：${element.count}${element.unit}，单价：${element.price.toFixed(2)}(元)，小计：${element.subtotal.toFixed(2)}(元)\n`;
    });
    result += '----------------------\n';
    result += '挥泪赠送商品：\n';
    freeItems.forEach(function (element) {
        result += `名称：${element.name}，数量：${element.freeCount}${element.unit}\n`;
    });
    result += '----------------------\n';
    result += `总计：${total.toFixed(2)}(元)\n`;
    result += `节省：${freeTotal.toFixed(2)}(元)\n`;
    result += '**********************';
    console.log(result);
}

function printInventory(inputs) {
    var decodeInputs = decodeBarcode(inputs);
    var preCartItems = mergeInpus(decodeInputs, loadAllItems());
    var cartItems = transferCartItems(preCartItems);
    var finalCartItems = caculateFreeCount(cartItems, loadPromotions());
    var billItems = caculateSubtotal(finalCartItems);
    var freeTotal = caculateFreeTotal(billItems);
    var total = caculateTotal(billItems);
    var freeItems = getFreeItem(billItems);
    printReceipt(billItems, freeItems, freeTotal, total);
}