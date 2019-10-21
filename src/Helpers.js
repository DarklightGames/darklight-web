
export function sortedToOrdering(sorted) {
    return Object.keys(sorted).map(key => {
        let value = sorted[key]
        return `${value.desc ? '-' : ''}${value.id}`
    }).join(',')
}

export function filteredToFilters(filtered) {
    return {
        ...Object.values(filtered)
            .reduce((newFilters, value) => {
                if (value.value === null || value.value.value === undefined) {
                    return {...newFilters}
                } else {
                    return {
                        ...newFilters, [value.id]: value.value.value
                    }
                }
            }, {})
    }
}