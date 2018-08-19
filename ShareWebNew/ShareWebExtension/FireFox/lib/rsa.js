function parseBigInt(t, r) {
    return new BigInteger(t, r)
}
function linebrk(t, r) {
    for (var n = "", i = 0; i + r < t.length;)n += t.substring(i, i + r) + "\n", i += r
    return n + t.substring(i, t.length)
}
function byte2Hex(t) {
    return 16 > t ? "0" + t.toString(16) : t.toString(16)
}
function pkcs1pad2(t, r) {
    if (r < t.length + 11)return alert("Message too long for RSA"), null
    for (var n = [], i = t.length - 1; i >= 0 && r > 0;) {
        var e = t.charCodeAt(i--)
        128 > e ? n[--r] = e : e > 127 && 2048 > e ? (n[--r] = 63 & e | 128, n[--r] = e >> 6 | 192) : (n[--r] = 63 & e | 128, n[--r] = e >> 6 & 63 | 128, n[--r] = e >> 12 | 224)
    }
    n[--r] = 0
    for (var o = new SecureRandom, s = []; r > 2;) {
        for (s[0] = 0; 0 == s[0];)o.nextBytes(s)
        n[--r] = s[0]
    }
    return n[--r] = 2, n[--r] = 0, new BigInteger(n)
}
function RSAKey() {
    this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null
}
function RSASetPublic(t, r) {
    null != t && null != r && t.length > 0 && r.length > 0 ? (this.n = parseBigInt(t, 16), this.e = parseInt(r, 16)) : alert("Invalid RSA public key")
}
function RSADoPublic(t) {
    return t.modPowInt(this.e, this.n)
}
function RSAEncrypt(t) {
    var r = pkcs1pad2(t, this.n.bitLength() + 7 >> 3)
    if (null == r)return null
    var n = this.doPublic(r)
    if (null == n)return null
    var i = n.toString(16)
    return 0 == (1 & i.length) ? i : "0" + i
}
function BigInteger(t, r, n) {
    null != t && ("number" == typeof t ? this.fromNumber(t, r, n) : null == r && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, r))
}
function nbi() {
    return new BigInteger(null)
}
function am1(t, r, n, i, e, o) {
    for (; --o >= 0;) {
        var s = r * this[t++] + n[i] + e
        e = Math.floor(s / 67108864), n[i++] = 67108863 & s
    }
    return e
}
function am2(t, r, n, i, e, o) {
    for (var s = 32767 & r, h = r >> 15; --o >= 0;) {
        var a = 32767 & this[t], p = this[t++] >> 15, u = h * a + p * s
        a = s * a + ((32767 & u) << 15) + n[i] + (1073741823 & e), e = (a >>> 30) + (u >>> 15) + h * p + (e >>> 30), n[i++] = 1073741823 & a
    }
    return e
}
function am3(t, r, n, i, e, o) {
    for (var s = 16383 & r, h = r >> 14; --o >= 0;) {
        var a = 16383 & this[t], p = this[t++] >> 14, u = h * a + p * s
        a = s * a + ((16383 & u) << 14) + n[i] + e, e = (a >> 28) + (u >> 14) + h * p, n[i++] = 268435455 & a
    }
    return e
}
function int2char(t) {
    return BI_RM.charAt(t)
}
function intAt(t, r) {
    var n = BI_RC[t.charCodeAt(r)]
    return null == n ? -1 : n
}
function bnpCopyTo(t) {
    for (var r = this.t - 1; r >= 0; --r)t[r] = this[r]
    t.t = this.t, t.s = this.s
}
function bnpFromInt(t) {
    this.t = 1, this.s = 0 > t ? -1 : 0, t > 0 ? this[0] = t : -1 > t ? this[0] = t + this.DV : this.t = 0
}
function nbv(t) {
    var r = nbi()
    return r.fromInt(t), r
}
function bnpFromString(t, r) {
    var n
    if (16 == r)n = 4
    else if (8 == r)n = 3
    else if (256 == r)n = 8
    else if (2 == r)n = 1
    else if (32 == r)n = 5
    else {
        if (4 != r)return this.fromRadix(t, r), void 0
        n = 2
    }
    this.t = 0, this.s = 0
    for (var i = t.length, e = !1, o = 0; --i >= 0;) {
        var s = 8 == n ? 255 & t[i] : intAt(t, i)
        0 > s ? "-" == t.charAt(i) && (e = !0) : (e = !1, 0 == o ? this[this.t++] = s : o + n > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - o) - 1) << o, this[this.t++] = s >> this.DB - o) : this[this.t - 1] |= s << o, o += n, o >= this.DB && (o -= this.DB))
    }
    8 == n && 0 != (128 & t[0]) && (this.s = -1, o > 0 && (this[this.t - 1] |= (1 << this.DB - o) - 1 << o)), this.clamp(), e && BigInteger.ZERO.subTo(this, this)
}
function bnpClamp() {
    for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t;)--this.t
}
function bnToString(t) {
    if (this.s < 0)return"-" + this.negate().toString(t)
    var r
    if (16 == t)r = 4
    else if (8 == t)r = 3
    else if (2 == t)r = 1
    else if (32 == t)r = 5
    else {
        if (4 != t)return this.toRadix(t)
        r = 2
    }
    var n, i = (1 << r) - 1, e = !1, o = "", s = this.t, h = this.DB - s * this.DB % r
    if (s-- > 0)for (h < this.DB && (n = this[s] >> h) > 0 && (e = !0, o = int2char(n)); s >= 0;)r > h ? (n = (this[s] & (1 << h) - 1) << r - h, n |= this[--s] >> (h += this.DB - r)) : (n = this[s] >> (h -= r) & i, 0 >= h && (h += this.DB, --s)), n > 0 && (e = !0), e && (o += int2char(n))
    return e ? o : "0"
}
function bnNegate() {
    var t = nbi()
    return BigInteger.ZERO.subTo(this, t), t
}
function bnAbs() {
    return this.s < 0 ? this.negate() : this
}
function bnCompareTo(t) {
    var r = this.s - t.s
    if (0 != r)return r
    var n = this.t
    if (r = n - t.t, 0 != r)return this.s < 0 ? -r : r
    for (; --n >= 0;)if (0 != (r = this[n] - t[n]))return r
    return 0
}
function nbits(t) {
    var r, n = 1
    return 0 != (r = t >>> 16) && (t = r, n += 16), 0 != (r = t >> 8) && (t = r, n += 8), 0 != (r = t >> 4) && (t = r, n += 4), 0 != (r = t >> 2) && (t = r, n += 2), 0 != (r = t >> 1) && (t = r, n += 1), n
}
function bnBitLength() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}
function bnpDLShiftTo(t, r) {
    var n
    for (n = this.t - 1; n >= 0; --n)r[n + t] = this[n]
    for (n = t - 1; n >= 0; --n)r[n] = 0
    r.t = this.t + t, r.s = this.s
}
function bnpDRShiftTo(t, r) {
    for (var n = t; n < this.t; ++n)r[n - t] = this[n]
    r.t = Math.max(this.t - t, 0), r.s = this.s
}
function bnpLShiftTo(t, r) {
    var n, i = t % this.DB, e = this.DB - i, o = (1 << e) - 1, s = Math.floor(t / this.DB), h = this.s << i & this.DM
    for (n = this.t - 1; n >= 0; --n)r[n + s + 1] = this[n] >> e | h, h = (this[n] & o) << i
    for (n = s - 1; n >= 0; --n)r[n] = 0
    r[s] = h, r.t = this.t + s + 1, r.s = this.s, r.clamp()
}
function bnpRShiftTo(t, r) {
    r.s = this.s
    var n = Math.floor(t / this.DB)
    if (n >= this.t)return r.t = 0, void 0
    var i = t % this.DB, e = this.DB - i, o = (1 << i) - 1
    r[0] = this[n] >> i
    for (var s = n + 1; s < this.t; ++s)r[s - n - 1] |= (this[s] & o) << e, r[s - n] = this[s] >> i
    i > 0 && (r[this.t - n - 1] |= (this.s & o) << e), r.t = this.t - n, r.clamp()
}
function bnpSubTo(t, r) {
    for (var n = 0, i = 0, e = Math.min(t.t, this.t); e > n;)i += this[n] - t[n], r[n++] = i & this.DM, i >>= this.DB
    if (t.t < this.t) {
        for (i -= t.s; n < this.t;)i += this[n], r[n++] = i & this.DM, i >>= this.DB
        i += this.s
    } else {
        for (i += this.s; n < t.t;)i -= t[n], r[n++] = i & this.DM, i >>= this.DB
        i -= t.s
    }
    r.s = 0 > i ? -1 : 0, -1 > i ? r[n++] = this.DV + i : i > 0 && (r[n++] = i), r.t = n, r.clamp()
}
function bnpMultiplyTo(t, r) {
    var n = this.abs(), i = t.abs(), e = n.t
    for (r.t = e + i.t; --e >= 0;)r[e] = 0
    for (e = 0; e < i.t; ++e)r[e + n.t] = n.am(0, i[e], r, e, 0, n.t)
    r.s = 0, r.clamp(), this.s != t.s && BigInteger.ZERO.subTo(r, r)
}
function bnpSquareTo(t) {
    for (var r = this.abs(), n = t.t = 2 * r.t; --n >= 0;)t[n] = 0
    for (n = 0; n < r.t - 1; ++n) {
        var i = r.am(n, r[n], t, 2 * n, 0, 1);
        (t[n + r.t] += r.am(n + 1, 2 * r[n], t, 2 * n + 1, i, r.t - n - 1)) >= r.DV && (t[n + r.t] -= r.DV, t[n + r.t + 1] = 1)
    }
    t.t > 0 && (t[t.t - 1] += r.am(n, r[n], t, 2 * n, 0, 1)), t.s = 0, t.clamp()
}
function bnpDivRemTo(t, r, n) {
    var i = t.abs()
    if (!(i.t <= 0)) {
        var e = this.abs()
        if (e.t < i.t)return null != r && r.fromInt(0), null != n && this.copyTo(n), void 0
        null == n && (n = nbi())
        var o = nbi(), s = this.s, h = t.s, a = this.DB - nbits(i[i.t - 1])
        a > 0 ? (i.lShiftTo(a, o), e.lShiftTo(a, n)) : (i.copyTo(o), e.copyTo(n))
        var p = o.t, u = o[p - 1]
        if (0 != u) {
            var f = u * (1 << this.F1) + (p > 1 ? o[p - 2] >> this.F2 : 0), g = this.FV / f, c = (1 << this.F1) / f, l = 1 << this.F2, b = n.t, v = b - p, m = null == r ? nbi() : r
            for (o.dlShiftTo(v, m), n.compareTo(m) >= 0 && (n[n.t++] = 1, n.subTo(m, n)), BigInteger.ONE.dlShiftTo(p, m), m.subTo(o, o); o.t < p;)o[o.t++] = 0
            for (; --v >= 0;) {
                var _ = n[--b] == u ? this.DM : Math.floor(n[b] * g + (n[b - 1] + l) * c)
                if ((n[b] += o.am(0, _, n, v, 0, p)) < _)for (o.dlShiftTo(v, m), n.subTo(m, n); n[b] < --_;)n.subTo(m, n)
            }
            null != r && (n.drShiftTo(p, r), s != h && BigInteger.ZERO.subTo(r, r)), n.t = p, n.clamp(), a > 0 && n.rShiftTo(a, n), 0 > s && BigInteger.ZERO.subTo(n, n)
        }
    }
}
function bnMod(t) {
    var r = nbi()
    return this.abs().divRemTo(t, null, r), this.s < 0 && r.compareTo(BigInteger.ZERO) > 0 && t.subTo(r, r), r
}
function Classic(t) {
    this.m = t
}
function cConvert(t) {
    return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
}
function cRevert(t) {
    return t
}
function cReduce(t) {
    t.divRemTo(this.m, null, t)
}
function cMulTo(t, r, n) {
    t.multiplyTo(r, n), this.reduce(n)
}
function cSqrTo(t, r) {
    t.squareTo(r), this.reduce(r)
}
function bnpInvDigit() {
    if (this.t < 1)return 0
    var t = this[0]
    if (0 == (1 & t))return 0
    var r = 3 & t
    return r = r * (2 - (15 & t) * r) & 15, r = r * (2 - (255 & t) * r) & 255, r = r * (2 - ((65535 & t) * r & 65535)) & 65535, r = r * (2 - t * r % this.DV) % this.DV, r > 0 ? this.DV - r : -r
}
function Montgomery(t) {
    this.m = t, this.mp = t.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << t.DB - 15) - 1, this.mt2 = 2 * t.t
}
function montConvert(t) {
    var r = nbi()
    return t.abs().dlShiftTo(this.m.t, r), r.divRemTo(this.m, null, r), t.s < 0 && r.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(r, r), r
}
function montRevert(t) {
    var r = nbi()
    return t.copyTo(r), this.reduce(r), r
}
function montReduce(t) {
    for (; t.t <= this.mt2;)t[t.t++] = 0
    for (var r = 0; r < this.m.t; ++r) {
        var n = 32767 & t[r], i = n * this.mpl + ((n * this.mph + (t[r] >> 15) * this.mpl & this.um) << 15) & t.DM
        for (n = r + this.m.t, t[n] += this.m.am(0, i, t, r, 0, this.m.t); t[n] >= t.DV;)t[n] -= t.DV, t[++n]++
    }
    t.clamp(), t.drShiftTo(this.m.t, t), t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
}
function montSqrTo(t, r) {
    t.squareTo(r), this.reduce(r)
}
function montMulTo(t, r, n) {
    t.multiplyTo(r, n), this.reduce(n)
}
function bnpIsEven() {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}
function bnpExp(t, r) {
    if (t > 4294967295 || 1 > t)return BigInteger.ONE
    var n = nbi(), i = nbi(), e = r.convert(this), o = nbits(t) - 1
    for (e.copyTo(n); --o >= 0;)if (r.sqrTo(n, i), (t & 1 << o) > 0)r.mulTo(i, e, n)
    else {
        var s = n
        n = i, i = s
    }
    return r.revert(n)
}
function bnModPowInt(t, r) {
    var n
    return n = 256 > t || r.isEven() ? new Classic(r) : new Montgomery(r), this.exp(t, n)
}
function Arcfour() {
    this.i = 0, this.j = 0, this.S = []
}
function ARC4init(t) {
    var r, n, i
    for (r = 0; 256 > r; ++r)this.S[r] = r
    for (n = 0, r = 0; 256 > r; ++r)n = n + this.S[r] + t[r % t.length] & 255, i = this.S[r], this.S[r] = this.S[n], this.S[n] = i
    this.i = 0, this.j = 0
}
function ARC4next() {
    var t
    return this.i = this.i + 1 & 255, this.j = this.j + this.S[this.i] & 255, t = this.S[this.i], this.S[this.i] = this.S[this.j], this.S[this.j] = t, this.S[t + this.S[this.i] & 255]
}
function prng_newstate() {
    return new Arcfour
}
function rng_seed_int(t) {
    rng_pool[rng_pptr++] ^= 255 & t, rng_pool[rng_pptr++] ^= t >> 8 & 255, rng_pool[rng_pptr++] ^= t >> 16 & 255, rng_pool[rng_pptr++] ^= t >> 24 & 255, rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
}
function rng_seed_time() {
    rng_seed_int((new Date).getTime())
}
function rng_get_byte() {
    if (null == rng_state) {
        for (rng_seed_time(), rng_state = prng_newstate(), rng_state.init(rng_pool), rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)rng_pool[rng_pptr] = 0
        rng_pptr = 0
    }
    return rng_state.next()
}
function rng_get_bytes(t) {
    var r
    for (r = 0; r < t.length; ++r)t[r] = rng_get_byte()
}
function SecureRandom() {
}
function hex_sha1(t) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(t)))
}
function b64_sha1(t) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(t)))
}
function any_sha1(t, r) {
    return rstr2any(rstr_sha1(str2rstr_utf8(t)), r)
}
function hex_hmac_sha1(t, r) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(t), str2rstr_utf8(r)))
}
function b64_hmac_sha1(t, r) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(t), str2rstr_utf8(r)))
}
function any_hmac_sha1(t, r, n) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(t), str2rstr_utf8(r)), n)
}
function sha1_vm_test() {
    return"a9993e364706816aba3e25717850c26c9cd0d89d" == hex_sha1("abc").toLowerCase()
}
function rstr_sha1(t) {
    return binb2rstr(binb_sha1(rstr2binb(t), 8 * t.length))
}
function rstr_hmac_sha1(t, r) {
    var n = rstr2binb(t)
    n.length > 16 && (n = binb_sha1(n, 8 * t.length))
    for (var i = Array(16), e = Array(16), o = 0; 16 > o; o++)i[o] = 909522486 ^ n[o], e[o] = 1549556828 ^ n[o]
    var s = binb_sha1(i.concat(rstr2binb(r)), 512 + 8 * r.length)
    return binb2rstr(binb_sha1(e.concat(s), 672))
}
function rstr2hex(t) {
    try {
    } catch (r) {
        hexcase = 0
    }
    for (var n, i = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", e = "", o = 0; o < t.length; o++)n = t.charCodeAt(o), e += i.charAt(n >>> 4 & 15) + i.charAt(15 & n)
    return e
}
function rstr2b64(t) {
    try {
    } catch (r) {
        b64pad = ""
    }
    for (var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = "", e = t.length, o = 0; e > o; o += 3)for (var s = t.charCodeAt(o) << 16 | (e > o + 1 ? t.charCodeAt(o + 1) << 8 : 0) | (e > o + 2 ? t.charCodeAt(o + 2) : 0), h = 0; 4 > h; h++)i += 8 * o + 6 * h > 8 * t.length ? b64pad : n.charAt(s >>> 6 * (3 - h) & 63)
    return i
}
function rstr2any(t, r) {
    var n, i, e, o, s = r.length, h = [], a = Array(Math.ceil(t.length / 2))
    for (n = 0; n < a.length; n++)a[n] = t.charCodeAt(2 * n) << 8 | t.charCodeAt(2 * n + 1)
    for (; a.length > 0;) {
        for (o = [], e = 0, n = 0; n < a.length; n++)e = (e << 16) + a[n], i = Math.floor(e / s), e -= i * s, (o.length > 0 || i > 0) && (o[o.length] = i)
        h[h.length] = e, a = o
    }
    var p = ""
    for (n = h.length - 1; n >= 0; n--)p += r.charAt(h[n])
    var u = Math.ceil(8 * t.length / (Math.log(r.length) / Math.log(2)))
    for (n = p.length; u > n; n++)p = r[0] + p
    return p
}
function str2rstr_utf8(t) {
    for (var r, n, i = "", e = -1; ++e < t.length;)r = t.charCodeAt(e), n = e + 1 < t.length ? t.charCodeAt(e + 1) : 0, r >= 55296 && 56319 >= r && n >= 56320 && 57343 >= n && (r = 65536 + ((1023 & r) << 10) + (1023 & n), e++), 127 >= r ? i += String.fromCharCode(r) : 2047 >= r ? i += String.fromCharCode(192 | r >>> 6 & 31, 128 | 63 & r) : 65535 >= r ? i += String.fromCharCode(224 | r >>> 12 & 15, 128 | r >>> 6 & 63, 128 | 63 & r) : 2097151 >= r && (i += String.fromCharCode(240 | r >>> 18 & 7, 128 | r >>> 12 & 63, 128 | r >>> 6 & 63, 128 | 63 & r))
    return i
}
function str2rstr_utf16le(t) {
    for (var r = "", n = 0; n < t.length; n++)r += String.fromCharCode(255 & t.charCodeAt(n), t.charCodeAt(n) >>> 8 & 255)
    return r
}
function str2rstr_utf16be(t) {
    for (var r = "", n = 0; n < t.length; n++)r += String.fromCharCode(t.charCodeAt(n) >>> 8 & 255, 255 & t.charCodeAt(n))
    return r
}
function rstr2binb(t) {
    for (var r = Array(t.length >> 2), n = 0; n < r.length; n++)r[n] = 0
    for (var n = 0; n < 8 * t.length; n += 8)r[n >> 5] |= (255 & t.charCodeAt(n / 8)) << 24 - n % 32
    return r
}
function binb2rstr(t) {
    for (var r = "", n = 0; n < 32 * t.length; n += 8)r += String.fromCharCode(t[n >> 5] >>> 24 - n % 32 & 255)
    return r
}
function binb_sha1(t, r) {
    t[r >> 5] |= 128 << 24 - r % 32, t[(r + 64 >> 9 << 4) + 15] = r
    for (var n = Array(80), i = 1732584193, e = -271733879, o = -1732584194, s = 271733878, h = -1009589776, a = 0; a < t.length; a += 16) {
        for (var p = i, u = e, f = o, g = s, c = h, l = 0; 80 > l; l++) {
            n[l] = 16 > l ? t[a + l] : bit_rol(n[l - 3] ^ n[l - 8] ^ n[l - 14] ^ n[l - 16], 1)
            var b = safe_add(safe_add(bit_rol(i, 5), sha1_ft(l, e, o, s)), safe_add(safe_add(h, n[l]), sha1_kt(l)))
            h = s, s = o, o = bit_rol(e, 30), e = i, i = b
        }
        i = safe_add(i, p), e = safe_add(e, u), o = safe_add(o, f), s = safe_add(s, g), h = safe_add(h, c)
    }
    return[i, e, o, s, h]
}
function sha1_ft(t, r, n, i) {
    return 20 > t ? r & n | ~r & i : 40 > t ? r ^ n ^ i : 60 > t ? r & n | r & i | n & i : r ^ n ^ i
}
function sha1_kt(t) {
    return 20 > t ? 1518500249 : 40 > t ? 1859775393 : 60 > t ? -1894007588 : -899497514
}
function safe_add(t, r) {
    var n = (65535 & t) + (65535 & r), i = (t >> 16) + (r >> 16) + (n >> 16)
    return i << 16 | 65535 & n
}
function bit_rol(t, r) {
    return t << r | t >>> 32 - r
}
function hex2b64(t) {
    var r, n, i = ""
    for (r = 0; r + 3 <= t.length; r += 3)n = parseInt(t.substring(r, r + 3), 16), i += b64map.charAt(n >> 6) + b64map.charAt(63 & n)
    for (r + 1 == t.length ? (n = parseInt(t.substring(r, r + 1), 16), i += b64map.charAt(n << 2)) : r + 2 == t.length && (n = parseInt(t.substring(r, r + 2), 16), i += b64map.charAt(n >> 2) + b64map.charAt((3 & n) << 4)); (3 & i.length) > 0;)i += b64padchar
    return i
}
function b64tohex(t) {
    var r, n, i = "", e = 0
    for (r = 0; r < t.length && t.charAt(r) != b64padchar; ++r)v = b64map.indexOf(t.charAt(r)), 0 > v || (0 == e ? (i += int2char(v >> 2), n = 3 & v, e = 1) : 1 == e ? (i += int2char(n << 2 | v >> 4), n = 15 & v, e = 2) : 2 == e ? (i += int2char(n), i += int2char(v >> 2), n = 3 & v, e = 3) : (i += int2char(n << 2 | v >> 4), i += int2char(15 & v), e = 0))
    return 1 == e && (i += int2char(n << 2)), i
}
function b64toBA(t) {
    var r, n = b64tohex(t), i = []
    for (r = 0; 2 * r < n.length; ++r)i[r] = parseInt(n.substring(2 * r, 2 * r + 2), 16)
    return i
}
var { Ci } = require('chrome');
var utils = require('sdk/window/utils');
var browserWindow = utils.getMostRecentBrowserWindow();
var window = browserWindow.content;
var navigator = window.navigator;
RSAKey.prototype.doPublic = RSADoPublic, RSAKey.prototype.setPublic = RSASetPublic, RSAKey.prototype.encrypt = RSAEncrypt
var dbits, canary = 0xdeadbeefcafe, j_lm = 15715070 == (16777215 & canary)
j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = am2, dbits = 30) : j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = am1, dbits = 26) : (BigInteger.prototype.am = am3, dbits = 28), BigInteger.prototype.DB = dbits, BigInteger.prototype.DM = (1 << dbits) - 1, BigInteger.prototype.DV = 1 << dbits
var BI_FP = 52
BigInteger.prototype.FV = Math.pow(2, BI_FP), BigInteger.prototype.F1 = BI_FP - dbits, BigInteger.prototype.F2 = 2 * dbits - BI_FP
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", BI_RC = [], rr, vv
for (rr = "0".charCodeAt(0), vv = 0; 9 >= vv; ++vv)BI_RC[rr++] = vv
for (rr = "a".charCodeAt(0), vv = 10; 36 > vv; ++vv)BI_RC[rr++] = vv
for (rr = "A".charCodeAt(0), vv = 10; 36 > vv; ++vv)BI_RC[rr++] = vv
Classic.prototype.convert = cConvert, Classic.prototype.revert = cRevert, Classic.prototype.reduce = cReduce, Classic.prototype.mulTo = cMulTo, Classic.prototype.sqrTo = cSqrTo, Montgomery.prototype.convert = montConvert, Montgomery.prototype.revert = montRevert, Montgomery.prototype.reduce = montReduce, Montgomery.prototype.mulTo = montMulTo, Montgomery.prototype.sqrTo = montSqrTo, BigInteger.prototype.copyTo = bnpCopyTo, BigInteger.prototype.fromInt = bnpFromInt, BigInteger.prototype.fromString = bnpFromString, BigInteger.prototype.clamp = bnpClamp, BigInteger.prototype.dlShiftTo = bnpDLShiftTo, BigInteger.prototype.drShiftTo = bnpDRShiftTo, BigInteger.prototype.lShiftTo = bnpLShiftTo, BigInteger.prototype.rShiftTo = bnpRShiftTo, BigInteger.prototype.subTo = bnpSubTo, BigInteger.prototype.multiplyTo = bnpMultiplyTo, BigInteger.prototype.squareTo = bnpSquareTo, BigInteger.prototype.divRemTo = bnpDivRemTo, BigInteger.prototype.invDigit = bnpInvDigit, BigInteger.prototype.isEven = bnpIsEven, BigInteger.prototype.exp = bnpExp, BigInteger.prototype.toString = bnToString, BigInteger.prototype.negate = bnNegate, BigInteger.prototype.abs = bnAbs, BigInteger.prototype.compareTo = bnCompareTo, BigInteger.prototype.bitLength = bnBitLength, BigInteger.prototype.mod = bnMod, BigInteger.prototype.modPowInt = bnModPowInt, BigInteger.ZERO = nbv(0), BigInteger.ONE = nbv(1), Arcfour.prototype.init = ARC4init, Arcfour.prototype.next = ARC4next
var rng_psize = 256, rng_state, rng_pool, rng_pptr
if (null == rng_pool) {
    rng_pool = [], rng_pptr = 0
    var t
    if (window.crypto && window.crypto.getRandomValues) {
        var ua = new Uint8Array(32)
        for (window.crypto.getRandomValues(ua), t = 0; 32 > t; ++t)rng_pool[rng_pptr++] = ua[t]
    }
    if ("Netscape" == navigator.appName && navigator.appVersion < "5" && window.crypto) {
        var z = window.crypto.random(32)
        for (t = 0; t < z.length; ++t)rng_pool[rng_pptr++] = 255 & z.charCodeAt(t)
    }
    for (; rng_psize > rng_pptr;)t = Math.floor(65536 * Math.random()), rng_pool[rng_pptr++] = t >>> 8, rng_pool[rng_pptr++] = 255 & t
    rng_pptr = 0, rng_seed_time()
}
SecureRandom.prototype.nextBytes = rng_get_bytes
var hexcase = 0, b64pad = "", b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", b64padchar = "="
var encrypt = function (a) {
    var b = new RSAKey, c = "BB24BD0371A3141EE992761C574F1AA20010420C446144922C00F07EFB3C7520D81210A3C66DEC43B75A2370D01CD1F23E1BFC93B907201F5116F29A2C8149E2D2671313A0A78E455BBFC20B802BA1CBEE1EBBEDA50290F040F0FD4EBE89F24DB546EBB6B16579675551B9016A1A6FDCE6F6933901395453885CF55369ADB999";
    return b.setPublic(c, "10001"), hex2b64(b.encrypt(a)).replace(/(.{64})/g, function (a) {
        return a += "\n"
    });
};
exports.encrypt = encrypt;