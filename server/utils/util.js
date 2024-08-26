var ret = {
    formatReturn: function (code, data = "") {
        return {
            code: code,
            data: data
        }
    },
    toBase64: (str) => {
        return Buffer.from(str).toString('base64');
    },
    fromBase64: (str) => {
        return Buffer.from(str, 'base64').toString();
    }
}

module.exports = ret;