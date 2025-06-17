import crypto from "crypto";

export const generateImageHash = (url: string): string => {
  return crypto.createHash("md5").update(url).digest("hex");
};

export const extractImageIdFromUrl = (url: string): string => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return matches ? matches[1] : url;
};
