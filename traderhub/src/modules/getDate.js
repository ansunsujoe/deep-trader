const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export function getDate() {
    var today = new Date();
    return monthNames[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
}