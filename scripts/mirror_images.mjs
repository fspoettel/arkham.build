/* eslint-disable no-undef */
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import allCardJson from "../src/store/graphql/data/stubs/all_card.json" assert { type: "json" };

const accountId: string = process.env["R2_ACCOUNT_ID"];
const accesKeyId = process.env["R2_ACCESS_KEY_ID"];
const accessKeySecret = process.env["R2_ACCESS_KEY_SECRET"]
const bucket = process.env["R2_BUCKET_NAME"]

const s3 = new S3Client({
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accesKeyId,
    secretAccessKey: accessKeySecret,
  },
  region: "auto",
  signatureVersion: 'v4',
});

syncCards().catch(console.error);

async function mirrorImage(url) {
  const key = url.split("/").at(-1);

  if (!key) {
    throw new Error(`could not extract key for ${url}, aborting.`);
  }

  try {
    await s3.send(new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    }));

    console.debug(`${key} found, skipping.`);
    return;
  } catch (_) {
    console.debug(`${key} not found, mirroring.`)
  }

  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error("error retrieving image, aborting.");
  }

  const imageBuffer = await response.arrayBuffer();

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: imageBuffer,
  }));

  console.debug(`${key} uploaded to S3.`);
}

async function syncCards() {
  const cards = allCardJson
    .all_card
    .filter(c => c.imageurl || c.backimageurl);

  for await (const card of cards) {
    if (card.imageurl) await mirrorImage(card.imageurl);
    if (card.backimageurl) await mirrorImage(card.backimageurl);
  }
}
