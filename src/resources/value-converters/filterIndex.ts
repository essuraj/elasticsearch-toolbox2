export class FilterValueConverter {
    toView(items, search) {
        if (search === "" || search === undefined) return items;
        return items.filter((item) => item.index.includes(search));
    }
}