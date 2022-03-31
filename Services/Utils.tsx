export const paginationDotCount = (dataArray: any[], moduloNumber: number) => {
    let count: number;
    if(dataArray == undefined) {
        count = 0;
    } else if(dataArray.length % moduloNumber > 0) {
        count = Math.trunc(dataArray.length / moduloNumber) + 1
    } else {
        count = dataArray.length / moduloNumber
    };

    return count;
};

export const formatNumber = (number: any) => {
    let formattedNumber = parseFloat(number);
    return formattedNumber
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export const formatDate = (dateString: string) => {
    if (!dateString) return "";
    let dateObj = new Date(dateString);
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let minutes = dateObj.getMinutes();
    let hour = dateObj.getHours();
    let newdate =
        ("0" + day).slice(-2) +
        "-" +
        ("0" + month).slice(-2) +
        "-" +
        year 
    return newdate;
};

