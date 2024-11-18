const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const { clientId, caseId, amount, dueDate } = req.body;
    const invoice = new Invoice({
      client: clientId,
      case: caseId,
      amount,
      dueDate,
      status: 'pending'
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('client')
      .populate('case');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('case');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status,
          paidAt: status === 'paid' ? new Date() : null
        }
      },
      { new: true }
    );
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 