export const getSortedByElementKey = (array, sortKey) => [...array].sort(({[sortKey]: key}) => key);
