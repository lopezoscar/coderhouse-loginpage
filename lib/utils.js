"use strict";
const crypto = require("crypto");
module.exports = {
    encrypt: (toEncrypt) => crypto.createHash("sha1").update(toEncrypt).digest("hex")
};