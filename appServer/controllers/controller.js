exports.request = (req,res) => {
    data = req.body;
    data = data.name
    res.send(data);
};
