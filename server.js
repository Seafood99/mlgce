const express = require('express');
const multer = require('multer');
const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const app = express();
const upload = multer({ limits: { fileSize: 1000000 } }); // Maksimal 1MB

// Inisialisasi Firestore dan Cloud Storage
const firestore = new Firestore();
const storage = new Storage();
const bucketName = 'mlgce-dawam'; // Ganti dengan nama bucket Anda

app.post('/predict', upload.single('image'), async (req, res) => {
    try {
        // Logika untuk memprediksi menggunakan model
        // Misalnya, load model dari Cloud Storage dan lakukan inferensi
        const predictionId = uuidv4();
        const result = 'Cancer'; // Ganti dengan logika prediksi
        const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

        // Simpan hasil prediksi ke Firestore
        await firestore.collection('predictions').doc(predictionId).set({
            id: predictionId,
            result: result,
            suggestion: suggestion,
            createdAt: moment().toISOString()
        });

        // Kembalikan response
        res.status(200).json({
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id: predictionId,
                result: result,
                suggestion: suggestion,
                createdAt: moment().toISOString()
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

