const express = require("express");
const router = express.Router();
const Currency = require("../models/Currency.js");
const { protect } = require('../middleware/authMiddleware');
const Rate = require("../models/Rate.js");

router.get("/", async (req, res) => {//method gia na pairnw ola ta currencies

    try { //oti vriskei to epistrefei
        const Currencies = await Currency.find();
        res.status(200).json(Currencies);
    } catch (error) {
        res.status(500).json({ message: error.message });//error apo server
    }

});

router.post("/", protect, async (req, res) => {//method gia neo currency

    try {
        const { Code, Name } = req.body; //pairnw ta Code,name params
        if (!Code || !Name) {//elegxw Code = Name = null tote  stelnv error
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        // Έλεγχος αν υπάρχει ήδη νόμισμα με ίδιο κωδικό ή όνομα
        const existingCurrency = await Currency.findOne({ $or: [{ Code: Code }, { Name: Name }] });

        if (existingCurrency) {
            return res.status(400).json({ message: "Currency already exists." });
        }

        const newCurrency = await Currency.create({ Code, Name }); //ftiaxnw to new currency me ta params poy pira
        res.status(201).json(newCurrency); //to epistrefw 
    } catch (error) {
        res.status(500).json({ message: error.message });//error apo server

    }
});


router.put("/:id", protect, async (req, res) => {
    try {
        // παιρνω το ιδ
        const { id } = req.params;
        // παιρνω τα  Code και Name από το request 
        const { Code: newCode, Name: newName } = req.body;

        // ελγχος εγκυροτητας
        if (!newCode || newCode.trim() === "" || !newName || newName.trim() === "") {
            return res
                .status(400)
                .json({ message: "Παρακαλώ δώστε έγκυρο κωδικό και όνομα." });
        }

        // βρισκω το νομισμα με βαση το ιδ της βασης
        const currentCurrency = await Currency.findById(id);
        if (!currentCurrency) {
            return res.status(404).json({ message: "Το νόμισμα δεν βρέθηκε." });
        }

        // παιρνω τις παλιες τιμες για ελεγχο
        const oldCode = currentCurrency.Code;
        const codeChanged = oldCode !== newCode;
        const nameChanged = currentCurrency.Name !== newName;

        // αν δεν εχει αλλαξει ο code / name τα επιστρεφω οπως ηταν
        if (!codeChanged && !nameChanged) {
            return res.status(200).json(currentCurrency);
        }

        // ελεγχω αν ειναι μοναδικα στην βαση δεν πρεπει να μοιαζουν με τα αλλα
        const checks = [];
        if (codeChanged) {
            checks.push({ Code: { $regex: `^${newCode}$`, $options: "i" } });
        }
        if (nameChanged) {
            checks.push({ Name: { $regex: `^${newName}$`, $options: "i" } });
        }

        if (checks.length > 0) {
            const existingCurrency = await Currency.findOne({
                $or: checks,
                _id: { $ne: id }, // εκτος του ιδιου 
            });

            if (existingCurrency) {
                // ελεγχος για ιδιο Code
                if (
                    codeChanged &&
                    existingCurrency.Code.toLowerCase() === newCode.toLowerCase()
                ) {
                    return res
                        .status(400)
                        .json({ message: "Υπάρχει ήδη νόμισμα με τον ίδιο κωδικό." });
                }
                // ελεγχος για ιδιο  Name
                if (
                    nameChanged &&
                    existingCurrency.Name.toLowerCase() === newName.toLowerCase()
                ) {
                    return res
                        .status(400)
                        .json({ message: "Υπάρχει ήδη νόμισμα με το ίδιο όνομα." });
                }
            }
        }

        // update πεδιων
        currentCurrency.Code = newCode;
        currentCurrency.Name = newName;
        await currentCurrency.save();

        // ενημερωση των rates Που περιεχουν το νομισμα
        if (codeChanged) {
            await Rate.updateMany(
                { FromType: oldCode },
                { $set: { FromType: newCode } }
            );
            await Rate.updateMany(
                { ToType: oldCode },
                { $set: { ToType: newCode } }
            );
        }

        res.status(200).json(currentCurrency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCurrency = await Currency.findByIdAndDelete(id);

        if (!deletedCurrency) {
            return res.status(404).json({ message: "Currency not found" });
        }

        // Get the Code from the deleted currency to delete associated rates
        const { Code } = deletedCurrency;
        // Delete rates that have this currency
        const deleteResult = await Rate.deleteMany({
            $or: [{ FromType: Code }, { ToType: Code }]
        });

        res.status(200).json({
            message: `Currency deleted.`,
            deletedCurrency,
            deletedRatesCount: deleteResult.deletedCount,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
