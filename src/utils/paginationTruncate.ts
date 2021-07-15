export const paginationTruncate = (currentPage, nrOfPages) => {
    var delta = 1,
        range = [],
        rangeWithDots = [],
        l;

    range.push(1);

    if (nrOfPages <= 1) {
        return range;
    }

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i < nrOfPages && i > 1) {
            range.push(i);
        }
    }
    range.push(nrOfPages);

    range.forEach(element => {
        if (l) {
            if (element - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (element - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(element);
        l = element;
    });

    return rangeWithDots;
}