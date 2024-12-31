import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import QRCode from "qrcode";
import { APP_URL } from "./constants/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateQR(text: string) {
  try {
    const url = `${APP_URL}/enable-2fa?code=${text}`
    const codeURI = await QRCode.toDataURL(url);
    return { codeURI, error: null };
  } catch (error) {
    return { codeURI: null, error };
  }
}
