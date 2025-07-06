const express = require("express");
const router = express.Router();
const Rate = require('../models/Rate.js');
const { protect } = require('../middleware/authMiddleware');



router.get("/",protect, async (req, res) => {//method gia na pairnw ola ta Rates

    try { //oti vriskei to epistrefei
        const rates = await Rate.find();
        res.status(200).json(rates);
    } catch (error) {
        res.status(500).json({ message: error.message });//error apo server
    }

});

router.post("/", protect, async (req, res) => {//method gia neo Rates

    try {
        const { FromType, ToType, RateValue } = req.body;

        if (!FromType || !ToType || RateValue == null) {//elegxw an lipsoun dedomena
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        if (FromType === ToType) { //ελεγχω αν ειναι ιδια τοτε πεταω ερρορ
            return res.status(400).json({ message: "The types must be different!" });
        }

        // ελεγχω αν υπαρχει ηδη τετοιο rate  τοτε παλι πεταω ερρορ
        const existingRate = await Rate.findOne({ FromType, ToType });
        if (existingRate) {
            return res.status(400).json({ message: "Rate between these currencies already exists." });
        }

        //ελεγχω αν το ratevalue = 0 ή αρνητικο τοτε παλι πεταω ερρορ
        const numericRateValue = parseFloat(RateValue);// κανω cast για να παρω σιγουρα νουμερο 

        if (isNaN(numericRateValue) || numericRateValue <= 0) {
            return res.status(400).json({ message: "Rate value must be a positive number." });
        }

        // ftiaxnw to new Rate me ta params poy pira (σε πεζά)
        const newRate = await Rate.create({
            FromType, ToType, RateValue: numericRateValue
        });
        const reverseRateExists = await Rate.findOne({ FromType: ToType, ToType: FromType }); //ftiaxnw kai to antistoixo anapodo rate gia synepeia kai apotropi lathwn


        let reverseRate = null; // to jekinaw me null se periptwsi ANN PAEI KATI LATHOS

        if (!reverseRateExists) {
            const reverseRateValue = parseFloat((1 / numericRateValue).toFixed(6));
            reverseRate = await Rate.create({
                FromType: ToType,
                ToType: FromType,
                RateValue: reverseRateValue
            });
        }

        res.status(201).json({ normal: newRate, reverse: reverseRate });
    } catch (error) {
        res.status(500).json({ message: error.message });//error apo server
    }
});


router.put("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { FromType, ToType, RateValue } = req.body;

        if (!FromType || !ToType || RateValue == null) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        if (FromType === ToType) {
            return res.status(400).json({ message: "The types must be different!" });
        }

        const numericRateValue = parseFloat(RateValue);
        if (isNaN(numericRateValue) || numericRateValue <= 0) {
            return res.status(400).json({ message: "Rate value must be a positive number." });
        }

        const existingRate = await Rate.findOne({ FromType, ToType, _id: { $ne: id } });
        if (existingRate) {
            return res.status(400).json({ message: "A rate between these currencies already exists." });
        }

        const currentRate = await Rate.findById(id);
        if (!currentRate) {
            return res.status(404).json({ message: "Rate not found" });
        }

        const updatedRate = await Rate.findByIdAndUpdate(id, {
            FromType,
            ToType,
            RateValue: numericRateValue
        }, { new: true });

        const reverseRateValue = parseFloat((1 / numericRateValue).toFixed(6));
        let deletedOldReverseRateId = null;

        // Βρίσκουμε το παλιό αντίστροφο rate, βασισμένο στις τιμές *πριν* την ενημέρωση
        const oldReverse = await Rate.findOne({ FromType: currentRate.ToType, ToType: currentRate.FromType });

        // Αν το παλιό αντίστροφο υπάρχει και το ζεύγος νομισμάτων άλλαξε, το διαγράφουμε
        if (oldReverse && (currentRate.FromType !== FromType || currentRate.ToType !== ToType)) {
            await Rate.findByIdAndDelete(oldReverse._id);
            deletedOldReverseRateId = oldReverse._id.toString();
        }

        // Ενημερώνουμε ή δημιουργούμε το νέο αντίστροφο rate με μία εντολή (upsert)
        const reverseRate = await Rate.findOneAndUpdate(
            { FromType: ToType, ToType: FromType },
            { RateValue: reverseRateValue },
            { upsert: true, new: true } // new: true επιστρέφει το ενημερωμένο/νέο έγγραφο
        );

        // Επιστρέφουμε όλα τα δεδομένα που χρειάζεται το frontend για να συγχρονιστεί
        res.status(200).json({ updated: updatedRate, reverse: reverseRate, deletedId: deletedOldReverseRateId });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.delete("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;

        const rateToDelete = await Rate.findById(id);
        if (!rateToDelete) {
            return res.status(404).json({ message: "Rate not found" });
        }

        // Βρίσκουμε το αντίστροφο rate για να πάρουμε το ID του
        const reverseRate = await Rate.findOne({
            FromType: rateToDelete.ToType,
            ToType: rateToDelete.FromType
        });

        // Διαγράφουμε το αρχικό rate
        await Rate.findByIdAndDelete(id);

        let deletedReverseRateId = null;
        // Αν βρέθηκε αντίστροφο rate, το διαγράφουμε και κρατάμε το ID του
        if (reverseRate) {
            await Rate.findByIdAndDelete(reverseRate._id);
            deletedReverseRateId = reverseRate._id.toString();
        }

        // Επιστρέφουμε τα IDs και των δύο rates που διαγράφηκαν
        res.status(200).json({
            deletedRateId: id,
            deletedReverseRateId: deletedReverseRateId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;  