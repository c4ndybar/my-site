
function getDateFromExpiration(expiresInSeconds) {
    return new Date(Date.now() + Number.parseInt(expiresInSeconds * 1000));
}

module.exports = { 
    getDateFromExpiration
}