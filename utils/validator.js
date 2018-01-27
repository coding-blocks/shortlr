exports = module.exports = {
    validUrl(longUrl) {
        if (longUrl.indexOf('x.co') !== -1) {
            return false
        }
        if (longUrl.indexOf('paypal') !== -1) {
            return false
        }

        return true
    }
}