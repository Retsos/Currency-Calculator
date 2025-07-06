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


router.put("/:Code", protect, async (req, res) => {//method gia update kapoio currency

    try {
        const { Code } = req.params; //pairnw to Code apo ta params tou url
        const { Name } = req.body; //παιρνω το ονομα απο το req

        if (!Name) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Έλεγχος αν υπάρχει άλλο νόμισμα με το ίδιο όνομα αλλά διαφορετικό Code
        const existingCurrency = await Currency.findOne({ Name: Name, Code: { $ne: Code } });
        if (existingCurrency) {
            return res.status(400).json({ message: "Currency already exists." })
        }

        const updatedCurrency = await Currency.findOneAndUpdate({ Code: Code }, req.body, { new: true }); //kanw search me vasi to code gia na vrw to swsto currency

        if (!updatedCurrency) {
            return res.status(404).json({ message: "Currency not found" });// error an den vrethei to item me to dwsmeno Code
        }
        res.status(200).json(updatedCurrency); // epistrefw 200 status + neo currency

    } catch (error) {
        res.status(500).json({ message: error.message }); //error apo server
    }
});


router.delete("/:Code", protect, async (req, res) => {
    try {
        const { Code } = req.params; // παιρνω το code apo ta params

        const deletedCurrency = await Currency.findOneAndDelete({ Code: Code });

        if (!deletedCurrency) {
            return res.status(404).json({ message: "Currency not found" });
        }

        // διαγραφη των rate που εχουν αυτο το currency
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
