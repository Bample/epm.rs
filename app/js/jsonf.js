/*
    小工具：
    JsonFind
*/

function isArray(o) {
    return typeof o == 'object' && Object.prototype.toString.call(o).slice(8, -1).toLowerCase() == 'array';
};


/**
 * 对json数据按照一定规则进行排列
 * @param {array} array [需要排序的数组]
 * @param {string} type [排序时所依据的字段]
 * @param {boolean} asc  [可选参数，默认降序，设置为true即为升序]
 * @return {none}    [无返回值]
 */

function sort(array, type, asc) {
    if (!isArray(array)) throw new Error('第一个参数必须是数组类型');
    var asc = asc || false;
    array.sort(function(a, b) {
        if (!asc) {
            return parseFloat(b[type]) - parseFloat(a[type]);
        } else {
            return parseFloat(a[type]) - parseFloat(b[type]);
        }
    });
};

/**
 * 对json数组进行搜索
 * @param {array} array [需要排序的数组]
 * @param {string} type [需要检索的字段]
 * @param {string} value [字段中应包含的值]
 * @return {array}    [包含指定信息的数组]
 */

function search(array, type, value) {
    if (!isArray(array)) throw new Error('第一个参数必须是数组类型');
    var arr = [];
    arr = array.filter(function(a) {
        return a[type].toString().indexOf(value) != -1;
    });
    return arr;
};

//////////////////////////////////////////////////
exports.search = search;
exports.sort = sort;
//////////////////////////////////////////////////