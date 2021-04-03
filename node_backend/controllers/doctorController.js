const Doctor = require('../models/Doctor');
const radiusOfEarth = 6371 // in Km
const doctorController = {};

doctorController.saveData = async (req, res) => {
    let response = {};
    try {
        let doctor = new Doctor(req.body);

        await doctor.save();

        response.status = true;
        response.savedDetails = req.body;
        res.json(response);
    }
    catch (error) {
        response.error = 'Someting went wrong';
        res.json(response);
    }
};

doctorController.getNearbyDoctors = async (req, res) => {
    let response = {};
    let latitude = req.body.lat * Math.PI / 180;  // converting to radian
    let longitude = req.body.long * Math.PI / 180;// converting to radian
    let radius = req.body.radius;
    let r = 2 * radius / radiusOfEarth;

    let lat_min = (latitude - r) * 180 / Math.PI;
    let lat_max = (latitude + r) * 180 / Math.PI;

    let del_long = Math.asin(Math.sin(r) / Math.cos(latitude));
    let long_min = (longitude - del_long) * 180 / Math.PI;
    let long_max = ((longitude + del_long) * 180) / Math.PI;

    response.geometry = {
        "lat_min": lat_min,
        "lat_max": lat_max,
        "long_min": long_min,
        "long_max": long_max
    }
    await Doctor.find({ "lat": { $lte: lat_max, $gte: lat_min }, "long": { $lte: long_max, $gte: long_min } }, function (err, docs) {
        if (err)
            response.error = err;
        else
            response.results = docs;
    }).limit(5).skip(req.body.page * 5);
    res.json(response);
};
doctorController.getOnlineDoctors = async (req, res) => {
    let response = {};

    await Doctor.find({ "isOnline": true }, function (err, docs) {
        if (err)
            response.error = err;
        else
            response.results = docs;
    });
    res.json(response);
};

module.exports = doctorController;