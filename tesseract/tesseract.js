import T from 'tesseract.js'

export const predictText = async (image, res) => {
    try {
        const result = await T.recognize(image, 'ind', {});
        const resultText = result.data.text.split('\n');
        res.json({ result: resultText });
    } catch (error) {
        console.error(error);
        return null;
    }
}
