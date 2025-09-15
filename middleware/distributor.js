module.exports = function(req, res, next) {
// 401 Unauthorize
// 403 Forbidden

if (!req.user.isDistributor) return res.status(403).send('Acces Denied.');
next()
}