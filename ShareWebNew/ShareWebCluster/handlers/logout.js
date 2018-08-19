const logout = function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.clearCookie('clustersid');
            res.send(JSON.stringify(null));
        }
    });
}

module.exports = logout;