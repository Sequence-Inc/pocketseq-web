const useReduceObject = (obj: Object, filterKeys: string[]) => {
    return Object.entries(
        Object.fromEntries(filterKeys.map((key) => [key, obj[key]]))
    ).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});
};

export default useReduceObject;
