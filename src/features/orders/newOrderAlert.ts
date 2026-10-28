import { toast } from "sonner";

import i18n from "@/lib/i18n";

let audio: AudioContext | undefined;

// A short two-tone chime, so there's no sound file to license or load.
// Browsers keep audio muted until the admin has clicked somewhere on the page.
export function playChime() {
  audio ??= new AudioContext();
  void audio.resume();

  [880, 1320].forEach((frequency, index) => {
    const start = audio!.currentTime + index * 0.18;
    const oscillator = audio!.createOscillator();
    const gain = audio!.createGain();

    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

    oscillator.connect(gain).connect(audio!.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.4);
  });
}

// Runs on a click, which is what lets the browser play sound and ask for permission.
export async function enableOrderAlerts() {
  playChime();
  if ("Notification" in window) await Notification.requestPermission();
}

export function canAskForNotifications() {
  return "Notification" in window && Notification.permission === "default";
}

export function alertNewOrder(orderId: number) {
  const message = i18n.t("admin.orders.newOrder", { id: orderId });

  playChime();
  toast.success(message);

  // Only works while the admin tab is open. Ringing with it closed needs Web Push (PWA, deferred).
  // iPhone Safari has no Notification outside an installed PWA.
  if (
    document.hidden &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    const notification = new Notification(message, { icon: "/favicon.svg" });
    notification.onclick = () => window.focus();
  }
}
