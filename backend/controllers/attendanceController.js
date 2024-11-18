const Attendance = require('../models/Attendance');
const moment = require('moment');

exports.checkIn = async (req, res) => {
  try {
    const attendance = new Attendance({
      user: req.user.uid,
      type: 'check-in'
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const attendance = new Attendance({
      user: req.user.uid,
      type: 'check-out'
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      user: req.user.uid,
      timestamp: {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      }
    };

    const attendance = await Attendance.find(query)
      .sort({ timestamp: 'asc' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 