import { makeElement } from "../htmlUtils.js";
import { Margin } from "./Margin.js";
import QrScanner from 'qr-scanner';

/* eslint-disable import/no-unresolved */ 
import qrScannerWorkerSource from '!!raw-loader!qr-scanner/qr-scanner-worker.min.js';
QrScanner.WORKER_PATH = URL.createObjectURL(new Blob([qrScannerWorkerSource]));

export async function QRScanner(onScan) {
  let webcamVideo = makeElement({
    tag: "video"
  })

  let QRInput = makeElement({
    tag: "div",
    children: [
      Margin(webcamVideo),
    ]
  });

  let stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
    },
    audio: false,
  });
  webcamVideo.srcObject = stream;
  let lastSeenValue = "";
  const qrScanner = new QrScanner(webcamVideo, function (value) {
    if (lastSeenValue == value) return;
    onScan(value);
  });
  qrScanner.start();
  
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