import { Storage } from "@google-cloud/storage";
import { gcsBucketName } from "../utils/constants.js";

const storage = new Storage();
const bucket = storage.bucket(gcsBucketName);

export async function uploadAudioToGCS(
  audioBuffer,
  contentType = "audio/mpeg"
) {
  const timestamp = Date.now();
  const filename = `audios/audio-${timestamp}.mp3`;
  const file = bucket.file(filename);

  await file.save(audioBuffer, {
    metadata: {
      contentType,
    },
    resumable: false,
  });

  return `https://storage.googleapis.com/${gcsBucketName}/${filename}`;
}
