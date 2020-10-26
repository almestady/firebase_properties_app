// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v4');
const fbAdmin = require('firebase-admin');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'propertiestag-25d9d'
});
fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(require('./ionic-function-firebase.json'))
  });

//   if (
//     !req.headers.authorization ||
//     !req.headers.authorization.startsWith('Bearer ')
//   ) {
//     return res.status(401).json({ error: 'Unauthorized!' });
//   }

//   let idToken;
//     idToken = req.headers.authorization.split('Bearer ')[1];

//     return fbAdmin
//         .auth()
//         .verifyIdToken(idToken)
//         .then(decodedToken => {
//           console.log(uploadData.type);
//         })  
const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v4');
const fbAdmin = require('firebase-admin');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'propertiestag-25d9d'
});

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(require('AIzaSyCFLk7p2LybX2Vpu9bIa2771ow94dXJFAo'))
  });

  exports.storeImage = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
      if (req.method !== 'POST') {
        return res.status(500).json({ message: 'Not allowed.' });
      }
  
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      ) {
        return res.status(401).json({ error: 'Unauthorized!' });
      }
  
      let idToken;
      idToken = req.headers.authorization.split('Bearer ')[1];
  
      const busboy = new Busboy({ headers: req.headers });
      let uploadData;
      let oldImagePath;
  
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const filePath = path.join(os.tmpdir(), filename);
        uploadData = { filePath: filePath, type: mimetype, name: filename };
        file.pipe(fs.createWriteStream(filePath));
      });
  
      busboy.on('field', (fieldname, value) => {
        oldImagePath = decodeURIComponent(value);
      });
  
      busboy.on('finish', () => {
        const id = uuid();
        let imagePath = 'images/' + id + '-' + uploadData.name;
        if (oldImagePath) {
          imagePath = oldImagePath;
        }
  
        return fbAdmin
          .auth()
          .verifyIdToken(idToken)
          .then(decodedToken => {
            console.log(uploadData.type);
            return storage
              .bucket('propertiestag-25d9d')
              .upload(uploadData.filePath, {
                uploadType: 'media',
                destination: imagePath,
                metadata: {
                  metadata: {
                    contentType: uploadData.type,
                    firebaseStorageDownloadTokens: id
                  }
                }
              });
          })
          .then(() => {
            return res.status(201).json({
              imageUrl:
                'https://firebasestorage.googleapis.com/v0/b/' +
                storage.bucket('propertiestag-25d9d').name +
                '/o/' +
                encodeURIComponent(imagePath) +
                '?alt=media&token=' +
                id,
              imagePath: imagePath
            });
          })
          .catch(error => {
            console.log(error);
            return res.status(401).json({ error: 'Unauthorized!' });
          });
      });
      return busboy.end(req.rawBody);
    });
  });
  

// exports.auth = functions.https.onRequest((req, res) => {
//     cors(req, res, () => {
//       const tokenId = req.get('Authorization').split('Bearer ')[1];
  
//       return admin.auth().verifyIdToken(tokenId)
//         .then((decoded) => res.status(200).send(decoded))
//         .catch((err) => res.status(401).send(err));
//     });
//   });