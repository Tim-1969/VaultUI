/* eslint-disable import/no-unresolved */
// @ts-ignore
import qrScannerWorkerSource from "!!raw-loader!qr-scanner/qr-scanner-worker.min.js";
QrScanner.WORKER_PATH = URL.createObjectURL(new Blob([qrScannerWorkerSource]));
// end ignore

import { Component, JSX, createRef } from "preact";
import { Margin } from "./Margin";
import QrScanner from "qr-scanner";

export type QRScannerProps = {
  onScan: (code: string) => void;
};

export class QRScanner extends Component<QRScannerProps, unknown> {
  videoElement = createRef<HTMLVideoElement>();

  stream: MediaStream;
  qrScanner: QrScanner;

  componentDidMount(): void {
    void navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      })
      .then((stream) => {
        this.stream = stream;
        this.videoElement.current.srcObject = stream;
        const lastSeenValue = "";
        const qrScanner = new QrScanner(this.videoElement.current, (value) => {
          if (lastSeenValue == value) return;
          this.props.onScan(value);
        });
        this.qrScanner = qrScanner;
        void qrScanner.start();
      });
  }
  componentWillUnmount(): void {
    try {
      this.qrScanner.destroy();
    } catch (_) {
      // Do Nothing
    }
  }

  render(): JSX.Element {
    return (
      <div>
        <Margin>
          <video ref={this.videoElement}></video>
        </Margin>
      </div>
    );
  }
}
