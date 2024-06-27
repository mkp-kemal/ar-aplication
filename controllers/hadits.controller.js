import { Storage } from '@google-cloud/storage';
import Hadits from '../models/hadits.model.js.js'
import { predictText } from '../tesseract/tesseract.js';
import * as path from 'path'
import * as uuid from 'uuid'

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'latihan-project-mkp',
  credentials: {
    type: "service_account",
    project_id: "latihan-project-mkp",
    private_key_id: "f87268d67a14e6990c26547b407c72735bf4afb2",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzl/9NSncQi1+V\nfXS0tf/wn37IeTOAykA9GmSIJu8T9Jl67g0CXfn0wnpwHfdgTLxpiqIv8IwfuC1f\nvbqIyJSSj8pwlHb1g9lPBhNH3gcbkgfPUvgwQoUnU20+u8XuCL4xtSPzfg/Tym82\n4MfJESITxL1tzurAdXXkA/iIcRVSeqvcPhTLk1pTnmjX6b59GWkjgpWOWUA2nuqw\noTL1jVRxEGknNog+h/6ramIQ0IQBfYPZDhcMkwUvAVBDoSY22+LJVeBib1rnYAho\naXMr/eFNdSrBztqIVkVp+96Bas6WymlYDGWaSQp9RHzZ3XdfC+uM4colyhTHLIGD\n4QXaQ/llAgMBAAECggEAA8vZZbTb7Mmawk+Ilq6niQVAv37FtpnlNGVzwpJayL00\nPAOphWdJ0AFcZ9+k9FrVkMA8IBn28aS0W4Boilj9wFYHHXdwnE1RMU5w5zqrmSBD\nx1TQUj+AY7hrvWu9X1ln9n0HFC/nUxQbDbnqqeFm1awkT5yUHHAJ3JazkOQduJno\nyOBW8Np4CBr7Lf8sCDVrVPtXIvZ/lxvx/B4JQOmtcYwDZmXkJMJLWFSB2u1ThRtx\n67gykYZZJfo7Qam3kvMe1w5m9bmzmvVYgpYnyhj7JbD5lKN7cD3zSmfRjzxqdzUH\nH0Vl6EXYRJ1Iez86CGGJDF//JzSQKyY4GMVuniodcQKBgQDtRfu39CxU+VWMzKL8\neaCg2Vxvk7PZYbka+YGchImQc3P25TKrw+pqJT3ejNhRNHqZ7tLMeBaz+zSuSTxq\n7XCPMV6eOsXbsmWCGWD7EP/V3/xzuq/eLj3DwDYduVg5un4DaoqvCAB2AlF3gF0v\nAX4P/y2WyUebwHOkkfUCZGMZZwKBgQDBxJ6L7ZBAQdP0v7FRCN7ff9x0pRe/e0wb\nl5Tc22ganf0aV/OfYIpXrGRJeMlsvul3/Y0pvPh/N5wcs0DGvnMgb1QFhOwF3Fk8\npoCD4qxCXyiGrvaQPMPVnd0qqGp5lLE7/HC9p4TYhcAP2LFTCGH7ekrVJCN7TAJt\nRSp2mXg7UwKBgGgVlBedEDlyavnp5vGUNUd6Mldr1rBccwQHQbk0Vtg8HTnIT1MU\nDWfk0GApLtdoiwOtxWEWqPbpErIFxHAvmnnmMVh99b+rYWYR1f4s9d2PdUIbOfzg\nEg4l6lddr/sa+R5shUvE2dbqq2wdrkLph7Biw0/rGfOUF+awdGdJPEOvAoGAHAyp\nYtol6pdc5m4lbfSZxsLMl/oaIPbpQolD3GDKhifersSSmLyx6hUjg1s/1UUhqOQE\nXkljs47KQ4FTXDHPmp9jC1V9kS+fn17+9ZiHlSgPRsfnG2QgeTjb/kPY/fafXW6i\np2GromhiMCkPKlTpUi0WzhnoJP4Qz96WUgrPU88CgYAsof1RAseCTZU24QPBViF/\nWicMK7W5/ytWaVxBiGj/yNciAzKR2lVpdho3KD4xqupkoZv1osPRpMJ0+kH9g0BK\nbigTos1OU9sRB3Nl7i5KTb1pQWmrF1eWh3kSkLQoSLqd06Y8Zt9eQAl6mNypaJ94\ncS26Tdj2O1qqyIn64+gz/w==\n-----END PRIVATE KEY-----\n",
    client_email: "project1@latihan-project-mkp.iam.gserviceaccount.com",
    client_id: "112380159211277570284",
  }
});

const bucketName = 'hadits_image';
const folderName = 'images';


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


const uploadImageToStorage = (file) => {
  const fileName = file.name;
  const [name, extension] = fileName.split('.');
  return new Promise((resolve, reject) => {
    const blob = storage.bucket(bucketName).file(uuid.v4() + "." + extension);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    });

    blobStream
      .on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      })
      .on('error', (err) => {
        reject(`Failed to upload image: ${err}`);
      })
      .end(file.data);
  });
};

const getImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send({ message: 'Gambar masih kosong!' });
    }

    const file = req.files.image;

    const imageUrl = await uploadImageToStorage(file);

    predictText(imageUrl, res);
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