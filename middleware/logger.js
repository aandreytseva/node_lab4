module.exports = (req, res, next) => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    console.log(`${req.method} | ${req.url} | ${dd}.${mm}.${yyyy} ${hh}:${min}`);
    next();
};
