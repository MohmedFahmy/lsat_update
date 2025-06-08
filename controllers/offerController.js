const { connectDB } = require('../config/db');
const { collection: offerCol } = require('../models/offerModel');
const { collection: ticketCol } = require('../models/ticketModel');
const { ObjectId } = require('mongodb');

exports.getOffers = async (req, res) => {
  try {
    const db = await connectDB();


    const ticketsWithOffers = await db.collection(ticketCol).find({ offer: true }).toArray();

    const results = await Promise.all(
      ticketsWithOffers.map(async (ticket) => {
        const ticketId = ticket._id;


        let offer = await db.collection(offerCol).findOne({ ticketId: ticketId.toString() });


        if (!offer) {
          const newOffer = {
            ticketId: ticketId.toString(),
            discountPercentage: 10, 
          };

          await db.collection(offerCol).insertOne(newOffer);
          offer = newOffer;
        }

  
        return {
          ticket,
          discountPercentage: offer.discountPercentage,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
