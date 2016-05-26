function decodeTags(tags) {
    var decodeTags = [];
    tags.forEach(function (element) {
        if (element.indexOf("-") > 0) {
            var splitedArray = element.split('-');
            var num = parseInt(splitedArray[1]) || 0;
            for (var i = 0; i < num; i++) {
                decodeTags.push(splitedArray[0]);
            }
        } else {
            decodeTags.push(element);
        }
    });
    return decodeTags;
}

function mergeTag(decodeTags) {
    var mergedTags = [];
    decodeTags.forEach(function (input) {
        var existItem = mergedTags.find(function (item) {
            return item.barcode === input;
        });

        if (!existItem) {
            existItem = {
                barcode: input,
                count: 0
            };
            mergedTags.push(existItem);
        }

        existItem.count++;
    })
    return mergedTags;
}

function mergeItems(decodeTags, allItems) {
    return decodeTags.map(function (element) {
        var existItem = allItems.find(function (item) {
            return item.barcode === element.barcode;
        });
        return Object.assign({ count: element.count }, existItem);
    }).filter(function (element) {
        return element.barcode;
    });
}

function calculateFreeCount(cartItems, promotionItems) {
    return cartItems.map(function (element) {
        var promotionBarcodes = promotionItems[0].barcodes;
        var freeCount = 0;
        if (promotionBarcodes.indexOf(element.barcode) > 0) {
            freeCount = Math.floor(element.count / 3);
        }
        return Object.assign({
            freeCount: freeCount
        }, element);;
    });
}

function calculateSubtotal(promotedCartItems) {
    return promotedCartItems.map(function (element) {
        return Object.assign({
            freeSubtotal: element.price * element.freeCount,
            subtotal: element.price * (element.count - element.freeCount)
        }, element);
    });
}

function calculateFreeTotal(billItems) {
    return billItems.reduce(function (a, b) {
        return {
            freeSubtotal: a.freeSubtotal + b.freeSubtotal
        };
    }).freeSubtotal;
}

function calculateTotal(billItems) {
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

function printReceipt(receipt) {
    var result = `***<没钱赚商店>购物清单***\n打印时间：${getDateString()}\n----------------------\n`;
    receipt.billItems.forEach(function (element) {
        result += `名称：${element.name}，数量：${element.count}${element.unit}，单价：${element.price.toFixed(2)}(元)，小计：${element.subtotal.toFixed(2)}(元)\n`;
    });
    result += '----------------------\n';
    result += '挥泪赠送商品：\n';
    receipt.freeItems.forEach(function (element) {
        result += `名称：${element.name}，数量：${element.freeCount}${element.unit}\n`;
    });
    result += '----------------------\n';
    result += `总计：${receipt.total.toFixed(2)}(元)\n`;
    result += `节省：${receipt.freeTotal.toFixed(2)}(元)\n`;
    result += '**********************';
    console.log(result);
}

function printInventory(inputs) {
    var decodeInputs = decodeTags(inputs);
    var mergedTags = mergeTag(decodeInputs);
    var cartItems = mergeItems(mergedTags, loadAllItems());
    var promotedCartItems = calculateFreeCount(cartItems, loadPromotions());
    var billItems = calculateSubtotal(promotedCartItems);
    var receipt = {
        billItems: billItems,
        freeTotal: calculateFreeTotal(billItems),
        total: calculateTotal(billItems),
        freeItems: getFreeItem(billItems)
    };
    printReceipt(receipt);
}