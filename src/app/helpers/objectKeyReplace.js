export function objectKeyReplace(obj, str) {
    const result = {};
    var re = new RegExp(str, "g");
    Object.keys(obj).forEach(function (key) {
        result[key.replace(re, '')] = obj[key];
    });

    return result;
}