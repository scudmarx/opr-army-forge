export { }

declare global {
    interface Array<T> {
        contains(predicate: (item: T) => boolean): boolean;
        findLast(predicate: (item: T) => boolean): T;
        findLastIndex(predicate: (item: T) => boolean): number;
    }
}

Array.prototype.contains = function (predicate: (item) => boolean): boolean {
    // code to remove "o"
    return this.findIndex(predicate) > -1;
}

Array.prototype.findLast = function (predicate: (item) => boolean) {
    const matches = this.filter(predicate);
    return matches[matches.length - 1];
}

Array.prototype.findLastIndex = function (predicate: (item) => boolean) {
    let l = this.length;
    while (l--) {
        if (predicate(this[l]))
            return l;
    }
    return -1;
}