module.exports.Lookup = (cookies, keyword) => {
    let search_value;
    cookies.split(';').forEach(entry => {
        let entry_name = entry.split('=')[0]
        let entry_value = entry.split('=')[1]
        if (entry_name === keyword) {
            search_value = entry_value
        }
    })
    return search_value
}