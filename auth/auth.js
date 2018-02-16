var crypto = require('crypto');
var i = 1;

exports.authToken = function authToken(emailH,tokenH) {
return 1;
}

exports.genRandomString = function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};
exports.sha512 = function sha512(password, salt,) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value,
    };
};
exports.saltHashPassword = function saltHashPassword(userpassword, salt) {
    console.log("1st line auth userpassword " + userpassword + "  saltX " + salt);
    if (salt === undefined) {
        // b was not passed
        salt = exports.genRandomString(16); /** Gives us salt of length 16 */
        token = exports.genRandomString(16); /** Gives us token of length 16 */
    }
    console.log("else ma gayu");
    var passwordData = exports.sha512(userpassword, salt);
    //console.log('UserPassword = '+userpassword); never ever uncomment this
    console.log('Passwordhash = ' + passwordData.passwordHash);
    console.log('nSalt ' + i + ' = ' + passwordData.salt);
    i = i + 1;
    var arr = { passHash: passwordData.passwordHash, salt: passwordData.salt ,token: exports.genRandomString(16)};
    return arr;
}