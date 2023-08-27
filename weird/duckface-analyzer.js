/**
 * FaceAPI Demo for NodeJS
 * - Uses external library [node-fetch](https://www.npmjs.com/package/node-fetch) to load images via http
 * - Loads image from provided param
 * - Outputs results to console
 */
/* edit: this script has been refactored for the 'duckface' project */

const fs = require('fs');
const process = require('process');
const path = require('path');
const log = require('@vladmandic/pilogger');
const _ = require('lodash');

const tf = require('@tensorflow/tfjs-node'); // in nodejs environments tfjs-node is required to be loaded before face-api
const faceapi = require('../dist/face-api.node.js'); // use this when using face-api in dev mode
// const faceapi = require('@vladmandic/face-api'); // use this when face-api is installed as module (majority of use cases)

// mongodb related functions
const MongoClient = require('mongodb').MongoClient;

async function MongoSave(object) {
  const client = new MongoClient(`mongodb://127.0.0.1:27017/faces`);
  await client.connect();
  try {
    await client.db()
      .collection('analysis')
      .insertOne(object);
    await client.close();
    log.info(`inserted object ${object.id}`);
    return true;
  } catch(error) {
    await client.close();
    log.error(`inserting object in 'analysis' collection: ${error.message}`);
    return false; 
  }
}

async function MongoRead(filter) {
  const client = new MongoClient(`mongodb://127.0.0.1:27017/faces`);
  await client.connect();
  const retv = await client.db()
    .collection('analysis')
    .find(filter)
    .toArray();
  await client.close();
  return retv;
}

const modelPathRoot = '../model';
const minConfidence = 0.15;
const maxResults = 5;
let optionsSSDMobileNet;
let fetch; // dynamically imported later

console.log("\n");
const options = _.reduce(process.argv, function(memo, arg) {
  if(arg.match(/=/)) {
    const chunks = arg.split('=');
    if(_.endsWith(chunks[0], '-image'))
      memo.source_image = chunks[1];
    else if(_.endsWith(chunks[0], '-source'))
      memo.source_dir = chunks[1];
    else {
      console.log(`Invalid option ${chunks[0]}`);
      console.log(`necessary -image=file or -source=directory as parameters`);
      process.exit(1);
    }
  }
  return memo;
}, {
  source_dir: null,
  source_image: null,
});

if(!options || (!options.source_dir && !options.source_image)) {
  console.log(`necessary -image=file or -source=directory as parameters`);
  process.exit(1);
}

async function image(input) {
  // read input image file and create tensor to be used for processing
  let buffer;
  log.info('Loading image:', input);
  if (input.startsWith('http:') || input.startsWith('https:')) {
    const res = await fetch(input);
    if (res && res.ok) buffer = await res.buffer();
    else log.error('Invalid image URL:', input, res.status, res.statusText, res.headers.get('content-type'));
  } else {
    buffer = fs.readFileSync(input);
  }

  // decode image using tfjs-node so we don't need external depenencies
  // can also be done using canvas.js or some other 3rd party image library
  if (!buffer) return {};
  const tensor = tf.tidy(() => {
    const decode = faceapi.tf.node.decodeImage(buffer, 3);
    let expand;
    if (decode.shape[2] === 4) { // input is in rgba format, need to convert to rgb
      const channels = faceapi.tf.split(decode, 4, 2); // tf.split(tensor, 4, 2); // split rgba to channels
      const rgb = faceapi.tf.stack([channels[0], channels[1], channels[2]], 2); // stack channels back to rgb and ignore alpha
      expand = faceapi.tf.reshape(rgb, [1, decode.shape[0], decode.shape[1], 3]); // move extra dim from the end of tensor and use it as batch number instead
    } else {
      expand = faceapi.tf.expandDims(decode, 0);
    }
    const cast = faceapi.tf.cast(expand, 'float32');
    return cast;
  });
  return tensor;
}

async function detect(tensor) {
  try {
    const result = await faceapi
      .detectAllFaces(tensor, optionsSSDMobileNet)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
      .withAgeAndGender();
    return result;
  } catch (err) {
    log.error('Caught error', err.message);
    return [];
  }
}

async function saveinfo(summary, img, shape) {
  /* summary --> {
  gender: 'male',
  genderProbability: 0.99327152967453,
  age: 60.559146881103516,
  expressions: yt {
    neutral: 0.9613013863563538,
    happy: 0.038698531687259674,
    sad: 2.8290989106949382e-8,
    angry: 1.4576404083754824e-8,
    fearful: 4.133656307872546e-15,
    disgusted: 8.545266183546119e-8,
    surprised: 1.3581331614886949e-9
  },
  expression: [ 'neutral', 0.9613013863563538 ],
  box: [
    66.66267824423748,
    195.83934235572815,
    315.9270122230053,
    291.7135248184204
  ] } */
  const chunks = img.split('/');
  const fname = chunks.pop();
  const mepid = fname.replace(/\.jpg/, '').replace(/\.jpeg/, '');
  const o = {
    id: mepid,
    fname,
    ...summary,
    imageShape: shape,
    when: new Date(),
  };
  return await MongoSave(o);
}

function print(face) {
  const expression = Object.entries(face.expressions).reduce((acc, val) => ((val[1] > acc[1]) ? val : acc), ['', 0]);
  const box = [face.alignedRect._box._x, face.alignedRect._box._y, face.alignedRect._box._width, face.alignedRect._box._height];
  const gender = `Gender: ${Math.round(100 * face.genderProbability)}% ${face.gender}`;
  log.data(`Detection confidence: ${Math.round(100 * face.detection._score)}% ${gender} Age: ${Math.round(10 * face.age) / 10} Expression: ${Math.round(100 * expression[1])}% ${expression[0]} Box: ${box.map((a) => Math.round(a))}`);
  return {
    gender: face.gender,
    genderProbability: face.genderProbability,
    age: face.age,
    expressions: face.expressions,
    expression,
    box,
  }
}

async function main() {
  log.header();
  log.info('FaceAPI single-process test');

  fetch = (await import('node-fetch')).default; // eslint-disable-line node/no-missing-import

  await faceapi.tf.setBackend('tensorflow');
  await faceapi.tf.ready();

  log.state(`Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${faceapi.version} Backend: ${faceapi.tf?.getBackend()}`);

  log.info('Loading FaceAPI models');
  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence, maxResults });

  const t0 = process.hrtime.bigint();
  const dir = options.source_dir ? _.map(fs.readdirSync(options.source_dir), function(fname) {
    return path.join(options.source_dir, fname);
  }) : [ options.source_image ];

  for (const img of dir) {
    if (!img.toLocaleLowerCase().endsWith('.jpg')) continue;
    const tensor = await image(img);
    const result = await detect(tensor);
    log.data('Image:', img, 'Detected faces:', result.length);
    for (const face of result) {
      let summary = print(face);
      await saveinfo(summary, img, tensor.shape);
    } 
    tensor.dispose();
  }
  const t1 = process.hrtime.bigint();
  log.info('Processed', dir.length, 'images in', Math.trunc(Number((t1 - t0)) / 1000 / 1000), 'ms');

  /*
    const param = process.argv[2];
    if (fs.existsSync(param) || param.startsWith('http:') || param.startsWith('https:')) {
      const tensor = await image(param);
      const result = await detect(tensor);
      log.data('Image:', param, 'Detected faces:', result.length);
      for (const face of result) print(face);
      tensor.dispose();
    }
  } */

}

main();
