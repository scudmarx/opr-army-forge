export function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export function distinct(arr: any[], property?: string) {
    const results = [];
    for (let item of arr)
        if (!results.filter(r => property ? r[property] === item[property] : r === item).length)
            results.push(item);
    return results;
};