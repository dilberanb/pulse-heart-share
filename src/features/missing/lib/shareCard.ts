import { toPng } from "html-to-image";

/**
 * Bir HTML düğümünü (kayıp kimlik kartı) PNG görseline çevirip indirir.
 * Sosyal medyada / yetkililere paylaşmak için ekran görüntüsü üretir.
 */
export async function downloadCardAsPng(node: HTMLElement, filename: string) {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
  });
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
  return dataUrl;
}

/**
 * Cihazın yerel paylaşım kutusunu açar (destekleniyorsa). Dosya ile paylaşmayı
 * sağlar — resimler/iOS/Android'de çalışır; masaüstünde büyük ölçüde yoktur.
 */
export async function nativeShare(dataUrl: string, title: string, text: string) {
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], "kayip-kimlik.png", { type: "image/png" });
  if (navigator.share) {
    await navigator.share({ title, text, files: [file] });
    return true;
  }
  return false;
}

/** WhatsApp paylaşım linki üretir. */
export function whatsappShare(link: string, text: string) {
  const msg = encodeURIComponent(`${text}\n${link}`);
  return `https://wa.me/?text=${msg}`;
}

/** X (Twitter) paylaşım linki üretir. */
export function twitterShare(link: string, text: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
}

/** Telegram paylaşım linki üretir. */
export function telegramShare(link: string, text: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
}
