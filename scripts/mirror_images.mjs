/* eslint-disable no-undef */
import {
  CopyObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "node:fs/promises";
import path from "node:path";

import allCardJson from "../src/store/services/data/stubs/all_card.json" assert { type: "json" };

const accountId = process.env["R2_ACCOUNT_ID"];
const accesKeyId = process.env["R2_ACCESS_KEY_ID"];
const accessKeySecret = process.env["R2_ACCESS_KEY_SECRET"];
const bucket = process.env["R2_BUCKET_NAME"];

const s3 = new S3Client({
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accesKeyId,
    secretAccessKey: accessKeySecret,
  },
  region: "auto",
  signatureVersion: "v4",
});

syncCards().catch(console.error);

async function mirrorImage(url) {
  const key = url.split("/").at(-1);

  if (!key) {
    throw new Error(`could not extract key for ${url}, aborting.`);
  }

  const contentType = key.endsWith("jpg") ? "image/jpeg" : "image/png";

  try {
    const head = await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    // used once to fixup missing content-type.
    if (!head.Metadata?.["content-type"]?.startsWith("image")) {
      console.debug(`${key} fixing up metadata.`);
      await s3.send(
        new CopyObjectCommand({
          Bucket: bucket,
          Key: key,
          CopySource: `${bucket}/${key}`,
          MetadataDirective: "REPLACE",
          ContentType: contentType,
          Metadata: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=2592000",
          },
        }),
      );
    }

    return;
  } catch (e) {
    console.debug(`${key} not found, mirroring.`);
  }

  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error("error retrieving image, aborting.");
  }

  const imageBuffer = await response.arrayBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
      Metadata: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000",
      },
    }),
  );

  console.debug(`${key} finished processing.`);
}

async function syncLocalImages() {
  const imageDir = "./src/assets/card-images";
  const contents = await fs.readdir(imageDir);

  const imagePaths = contents.reduce((acc, curr) => {
    if (curr.endsWith(".jpg")) acc.push(
      path.join(imageDir, curr)
    );
    return acc;
  }, []);

  for await (const imagePath of imagePaths) {
    const imageBuffer = await fs.readFile(imagePath);
    const key = path.basename(imagePath);
    const contentType = "image/jpeg";

    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
      continue;
    } catch {
      console.debug(`${key} does not exist, uploading...`);
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: imageBuffer,
        ContentType: contentType,
        Metadata: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=2592000",
        },
      }),
    );

    console.debug(`${key} finished processing.`);
    }
}

async function syncCards() {
  await syncLocalImages();


  const cards = allCardJson.all_card.filter(
    (c) => c.imageurl || c.backimageurl,
  );

  for await (const card of cards) {
    if (card.imageurl) await mirrorImage(card.imageurl);
    if (card.backimageurl) await mirrorImage(card.backimageurl);
    console.debug(`${key} finished processing.`);
  }
}
