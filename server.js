const express = require("express");
const crypto = require("crypto");

const app = express();

// ===============================
// 🔐 إعدادات الحماية
// ===============================
const SECRET_KEY = "MY_SECRET_123";
const WINDOW = 60; // كل 30 ثانية

// ===============================
// 📺 روابط البث
// ===============================
const streams = {
    "123": "http://localhost:3000/streams/1781198990476/index.m3u8",
    "234": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "345": "https://stream-lb.livemediama.com/2m/hls/master.m3u8",
    "456": "http://clubsmartlive.com:80/live/rYTCg4asp/twJ15X9a/44393.ts",
    "789": "http://clubsmartlive.com:80/live/rYTCg4asp/twJ15X9a/44390.ts"
};

// ===============================
// 🧠 توليد Token ديناميكي
// ===============================
function generateToken(id) {

    const timeWindow = Math.floor(Date.now() / 1000 / WINDOW);

    const data = `${id}:${timeWindow}:${SECRET_KEY}`;

    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

// ===============================
// 🏠 Home
// ===============================
app.get("/", (req, res) => {
    res.send("🚀 IPTV Proxy Running with Dynamic Token");
});

// ===============================
// 📺 Watch Route
// ===============================
app.get("/watch/:id", (req, res) => {

    const id = req.params.id;
    const token = req.query.token;

    const url = streams[id];

    if (!url) {
        return res.status(404).send("Stream not found ❌");
    }

    // 🔐 تحقق من التوكن
    const validToken = generateToken(id);

    if (token !== validToken) {
        return res.status(403).send("Invalid or expired token ❌");
    }

    // 🔁 إعادة توجيه للبث
    return res.redirect(url);
});

// ===============================
// 🚀 تشغيل السيرفر
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("✅ Server running on port " + PORT);
});
