const Case = require('../models/Case');
const Client = require('../models/Client');

exports.createCase = async (req, res) => {
  try {
    const { clientId, title, description } = req.body;
    const newCase = new Case({
      client: clientId,
      associate: req.user.uid,
      title,
      description
    });

    const savedCase = await newCase.save();
    
    // Update client's cases array
    await Client.findByIdAndUpdate(clientId, {
      $push: { cases: savedCase._id }
    });

    res.status(201).json(savedCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('client')
      .populate('associate');
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const case_ = await Case.findById(req.params.id)
      .populate('client')
      .populate('associate');
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(case_);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const case_ = await Case.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(case_);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addUpdate = async (req, res) => {
  try {
    const { content } = req.body;
    const case_ = await Case.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          updates: {
            content,
            updatedBy: req.user.uid,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    res.json(case_);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 