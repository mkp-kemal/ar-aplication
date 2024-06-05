import Hadits from '../models/hadits.model.js.js'
import { predictText } from '../tesseract/tesseract.js';
import * as path from 'path'
import * as uuid from 'uuid'

const getAllHadits = async (req, res) => {
  try {
    Hadits.find().
      then(data => res.send(data)).
      catch(err => res.status(500).send({ message: err.message }))
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error: ', err.message);
  }
};

const getImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ message: 'No files were uploaded.' });
    }

    const imageFile = req.files.image;
    const fileName = imageFile.name;
    const [name, extension] = fileName.split('.');
    const uniqueFileName = uuid.v4() + "." + extension;
    const uploadPath = path.join(process.cwd(), 'assets', uniqueFileName);

    imageFile.mv(uploadPath, (err) => {
      if (err) return res.status(500).send(err);
      predictText(uploadPath, res);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send({ message: 'Server error.' });
  }
};

const createHadits = async (req, res) => {
  try {
    const { no_hadith, rawi, sanad, matan, reference, source } = req.body;
    const hadits = new Hadits({
      no_hadith,
      rawi,
      sanad,
      matan,
      reference,
      source
    });
    hadits.save()
      .then(data => res.send(data))
      .catch(err => res.status(500).send({ message: err.message }));
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error: ', err.message);
  }
};

const getHaditsByReference = async (req, res) => {
  try {
    const reference = req.params.reference;
    const hadits = await Hadits.findOne({ reference });

    if (!hadits) {
      return res.status(404).json({ message: 'Hadits not found' });
    }

    res.json(hadits);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error: ', err.message);
  }
};



export { getAllHadits, createHadits, getHaditsByReference, getImage }