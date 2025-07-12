import { Router } from 'express';
import SwapCreate from '../models/SwapCreate.js';
import SwapAccept from '../models/SwapAccept.js';

const router = Router();

router.post('/request', async (req, res) => {
  try {
    const { senderEmail, receiverEmail, senderProductId, requestedProductId } = req.body;

    const swap = new SwapCreate({ senderEmail, receiverEmail, senderProductId, requestedProductId });
    await swap.save();

    const responseEntry = new SwapAccept({ swapRequest: swap._id });
    await responseEntry.save();

    res.status(201).json({ msg: 'Swap request created', swap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/respond', async (req, res) => {
  try {
    const { swapRequestId, accept, notes } = req.body;

    const swap = await SwapCreate.findById(swapRequestId);
    if (!swap) return res.status(404).json({ msg: 'Swap request not found' });

    const response = await SwapAccept.findOne({ swapRequest: swapRequestId });
    if (!response || response.isResponded) {
      return res.status(400).json({ msg: 'Already responded' });
    }

    response.accepted = accept;
    response.isResponded = true;
    response.notes = notes || '';
    response.respondedAt = new Date();
    await response.save();

    swap.status = accept ? 'accepted' : 'rejected';
    await swap.save();

    res.json({ msg: `Swap ${accept ? 'accepted' : 'rejected'}`, swap, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;

    const sentSwaps = await SwapCreate.find({ senderEmail: userEmail }).populate('senderProductId requestedProductId');
    const receivedSwaps = await SwapCreate.find({ receiverEmail: userEmail }).populate('senderProductId requestedProductId');

    const combineWithResponse = async (swaps) => {
      return Promise.all(swaps.map(async (swap) => {
        const response = await SwapAccept.findOne({ swapRequest: swap._id });
        return {
          ...swap._doc,
          response: response ? {
            accepted: response.accepted,
            isResponded: response.isResponded,
            notes: response.notes,
            respondedAt: response.respondedAt,
          } : null,
        };
      }));
    };

    const history = {
      sent: await combineWithResponse(sentSwaps),
      received: await combineWithResponse(receivedSwaps),
    };

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
