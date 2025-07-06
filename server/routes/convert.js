const express = require('express');
const Rate = require("../models/Rate.js");
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { FromType, ToType, Value } = req.body;
        const amountToConvert = parseFloat(Value);

        //  ελεγχοι εγκυροτητας
        if (!FromType || !ToType || Value == null) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        if (FromType === ToType) {
            return res.status(400).json({ message: "The types must be different!" });
        }
        if (amountToConvert <= 0 || isNaN(amountToConvert)) {
            return res.status(400).json({ message: "Value must be a positive number." });
        }

        //  παιρνω τα rates
        const allRates = await Rate.find();

        //  Set για αποφυγη κυκλων (π.χ. EUR → USD → EUR → ...)
        const visited = new Set();


        function findRateRecursive(current, target, rateSoFar) {
            //  Αν φτάσαμε στον προορισμό, επιστρέφουμε τον συνολικό rate
            if (current === target) {
                return rateSoFar;
            }

            //  Προσθέτουμε το τρέχον νόμισμα στο visited
            visited.add(current);

            //  Ψάχνουμε όλα τα rates που ξεκινούν ή καταλήγουν στο current
            for (const rate of allRates) {
                //  Προώθηση: current → next
                if (rate.FromType === current && !visited.has(rate.ToType)) {
                    const result = findRateRecursive(rate.ToType, target, rateSoFar * rate.RateValue);
                    if (result !== null) return result;
                }

                //  Οπισθοδρόμηση: current ← next
                else if (rate.ToType === current && !visited.has(rate.FromType)) {
                    const result = findRateRecursive(rate.FromType, target, rateSoFar * (1 / rate.RateValue));
                    if (result !== null) return result;
                }
            }

            //  Αν δεν βρεθηκε διαδρομη που λογικα θα βρεθει 100%
            return null;
        }

        // ξεκιναμε την αναδρομή
        const finalRate = findRateRecursive(FromType, ToType, 1);

        if (finalRate === null) {
            return res.status(404).json({ message: "No conversion path found." });
        }

        //  τελικο ποσο
        const convertedAmount = (finalRate * amountToConvert).toFixed(2);

        //κανω αναζητηση να δω αν υπαρχει το rate αλλιως το φτιαχνω για να μην κανει ξανα search οπως και το αναποδο rate
        const existingRate = await Rate.findOne({ FromType, ToType });
        if (!existingRate) {
            await Rate.create({ FromType, ToType, RateValue: finalRate });

            const reverseRateExists = await Rate.findOne({ FromType: ToType, ToType: FromType }); //ftiaxnw kai to antistoixo anapodo rate gia synepeia kai apotropi lathwn

            let reverseRate = null;

            if (!reverseRateExists) {
                const reverseRateValue = parseFloat((1 / finalRate).toFixed(6));
                reverseRate = await Rate.create({
                    FromType: ToType,
                    ToType: FromType,
                    RateValue: reverseRateValue
                });
            }
        }

        return res.json({ convertedAmount });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
