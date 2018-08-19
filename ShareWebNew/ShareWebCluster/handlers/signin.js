const signin = function (req, res) {
    const user = req.body;
    req.session.user = user;
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(null));
}

module.exports = signin;