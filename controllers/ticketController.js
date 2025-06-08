const {connectDB} = require('../config/db');
const { collection } = require('../models/ticketModel');
const { ObjectId } = require('mongodb');

exports.getAllTickets = async (req, res) => {
  const db = await connectDB();
  const tickets = await db.collection(collection).find().toArray();
  res.json(tickets);
};

exports.searchTickets = async (req, res) => {
    const { departure, arrival } = req.query;
    
    // التأكد من أن المعاملات موجودة
    if (!departure || !arrival) {
      return res.status(400).json({ message: "Both departure and arrival stations are required." });
    }
  
    try {
      const db = await connectDB();
      const tickets = await db.collection(collection) // تأكد من استخدام اسم الـ collection الصحيح
        .find({ departure: departure, arrival: arrival })
        .toArray();
      
      // التحقق من وجود تذاكر تم العثور عليها
      if (tickets.length === 0) {
        return res.status(404).json({ message: "No tickets found for the provided stations." });
      }
  
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ message: "Error while searching for tickets", error: err.message });
    }
  };
  
exports.getTicketById = async (req, res) => {
  const { id } = req.params;


  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ticket ID." });
  }

  try {
    const db = await connectDB();
    const ticket = await db.collection(collection).findOne({ _id: new ObjectId(id) });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ticket", error: err.message });
  }
};