const Client = require('../models/Client');

exports.createClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const client = new Client({
      name,
      email,
      phone,
      documents: [],
      cases: []
    });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('cases');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('cases');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addDocument = async (req, res) => {
  try {
    const { url, name } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          documents: {
            url,
            name,
            uploadedAt: new Date()
          }
        }
      },
      { new: true }
    );
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 