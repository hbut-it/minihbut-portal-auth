const Service = require("egg").Service;
const CryptoJS = require("crypto-js");

class EncryptService extends Service {
  getAesString(n, f, c) {
    f = f.replace(/(^\s+)|(\s+$)/g, "");
    f = CryptoJS.enc.Utf8.parse(f);
    c = CryptoJS.enc.Utf8.parse(c);
    return CryptoJS.AES.encrypt(n, f, {
      iv: c,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  randomString(n) {
    let f = "";
    const aes_chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    for (let i = 0; i < n; i++)
      f += aes_chars.charAt(Math.floor(Math.random() * aes_chars.length));
    return f;
  }

  encryptAES(n, f) {
    return f
      ? this.getAesString(this.randomString(64) + n, f, this.randomString(16))
      : n;
  }

  encryptPassword(n, f) {
    try {
      return this.encryptAES(n, f);
    } catch (err) {
      console.error("encryptAES failed:", err);
      return n;
    }
  }
}

module.exports = EncryptService;
