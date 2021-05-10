import { Margin } from "./Margin";
import { makeElement } from "../htmlUtils";
import QrScanner from 'qr-scanner';

/* eslint-disable import/no-unresolved */
// @ts-ignore
import qrScannerWorkerSource from '!!raw-loader!qr-scanner/qr-scanner-worker.min.js';
QrScanner.WORKER_PATH = URL.createObjectURL(new Blob([qrScannerWorkerSource]));

export interface QRScannerType extends HTMLElement {
  deinit(): void;
}

export async function QRScanner(onScan: (code: string) => void): Promise<QRScannerType>  {
  const webcamVideo = makeElement({
    tag: "video"
  }) as HTMLVideoElement;

  const QRInput = makeElement({
    tag: "div",
    children: [
      Margin(webcamVideo),
    ]
  }) as QRScannerType;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
    },
    audio: false,
  });
  webcamVideo.srcObject = stream;
  const lastSeenValue = "";
  const qrScanner = new QrScanner(webcamVideo, function (value) {
    if (lastSeenValue == value) return;
    onScan(value);
  });
  void qrScanner.start();
  
  QRInput.deinit = () => {
    try {
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    } catch (_) {
      ()=>{};
    }
  };

  return QRInput;
}