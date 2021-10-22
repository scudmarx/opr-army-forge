//import _ from "lodash";

export function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};


export function distinct(arr: any[], property?: string) {
  const results = [];
  for (let item of arr)
    if (!results.some(r => property ? r[property] === item[property] : r === item))
      results.push(item);
  return results;
};