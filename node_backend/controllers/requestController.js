const Requests = require('../models/Requests');
const User = require('../models/User');
const Doctor = require('../models/Doctor')
var ObjectId = require('mongoose').Types.ObjectId;
const requestController = {};

requestController.newRequest = async (req, res) => {
    let response = {};
    try {
        let request = new Requests(req.body);
        let doctorDetails = await Doctor.find({ _id: new ObjectId(String(req.body.to)) });
        console.log(doctorDetails[0]);
        let actualDocDetails = await User.find({ username: doctorDetails[0].name });
        console.log(actualDocDetails[0]);
        request.to = actualDocDetails[0]._id;
        response.result = await request.save();
        response.success = true;
        res.json(response);
    }
    catch (error) {
        response.error = "Some error occurred while trying to make request, try after some time";
    }
};
requestController.getAllRequestsByUser = async (req, res) => {
    let response = {};
    try {
        let requests = await Requests.find({ "from": req.params.userId }).limit(10);
        response.requests = requests;
        response.success = true;
        res.json(response);
    } catch (error) {
        response.message = `The server encountered an error while getting all the posts ${error}`;
        res.json(response);
    }
};
requestController.getAllRequestsByUserTo = async (req, res) => {
    let response = {};
    try {
        let requests = await Requests.find({ "toUsername": req.params.userId }).limit(10);
        response.requests = requests;
        response.success = true;
        res.json(response);
    } catch (error) {
        response.message = `The server encountered an error while getting all the posts ${error}`;
        res.json(response);
    }
};
requestController.updateRequest = async (req, res) => {
    let response = {};
    try {
        if (req.body.update === 'accept') {
            response.result = await Requests.update({ _id: new ObjectId(req.body._id) }, { $set: { "isAccepted": true, "isRejected": false } });
        }
        else if (req.body.update === 'reject') {
            response.result = await Requests.update({ _id: new ObjectId(req.body._id) }, { $set: { "isAccepted": false, "isRejected": true } });
        }
        response.updatedRecord = await Requests.find({ _id: new ObjectId(req.body._id) });
        response.success = true;
        res.json(response);
    }
    catch (error) {
        response.error = "Something went wrong... try after some time";
        response.success = false;
        res.json(response);
    }
}
module.exports = requestController;
