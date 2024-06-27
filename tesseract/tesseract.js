import T from 'tesseract.js'
import axios from 'axios'

export const predictText = async (image, res) => {
    try {
        const result = await T.recognize(image, 'ind', {});
        let resultText = result.data.text;
        resultText = resultText.replace(/\n/g, ' ');

        const response = await axios.get(`https://ar-aplication.vercel.app/v1/api/hadits/${resultText}`)
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    return {
                        data: []
                    };
                }
                throw error;
            });
        if (response.data.length === 0) {
            return res.status(404).json({ message: 'Hadits tidak ditemukan, coba gambar lain' });
        }
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Hadits tidak ditemukan, coba gambar lain' });
        }
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
