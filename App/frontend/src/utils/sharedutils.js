export const fetchData = async (url, flatten = false, callback) => {
    let response = await fetch(url);
    let responseJSON = await response.json();
    console.log(`Fetch data:`);
    console.log(responseJSON);
    if (flatten) {
        let rows = responseJSON.map(obj => Object.values(obj));
        callback(rows);
    }
    else
        callback(responseJSON);
}