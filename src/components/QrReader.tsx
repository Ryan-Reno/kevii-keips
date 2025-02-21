import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface Html5QrReaderProps {
  onResult: (data: string) => void;
}

const QrReader = ({ onResult }: Html5QrReaderProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define a unique ID for the scanner element
    const qrCodeId = "qr-code-reader";

    // Make sure we have the container element
    if (!qrRef.current) return;

    // Create or find the scanner container
    let scannerContainer = document.getElementById(qrCodeId);
    if (!scannerContainer) {
      scannerContainer = document.createElement("div");
      scannerContainer.id = qrCodeId;
      qrRef.current.appendChild(scannerContainer);
    }

    // Create scanner instance
    const html5QrCode = new Html5Qrcode(qrCodeId);
    let isScanning = false;

    const startScanner = async () => {
      try {
        // Check camera availability first
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              console.log("QR Code detected:", decodedText);
              onResult(decodedText);
            },
            () => {
              /* Ignore errors during normal scanning */
            }
          );

          isScanning = true;
          console.log("HTML5 QR scanner started successfully");
        } else {
          console.error("No cameras found");
        }
      } catch (err) {
        console.error("Error starting scanner:", err);
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (html5QrCode && isScanning) {
        html5QrCode
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, [onResult]);

  return (
    <div className="qr-scanner-container">
      <div
        ref={qrRef}
        className="relative h-[300px] w-full overflow-hidden rounded-lg bg-gray-100"
      />
      <div className="mt-2 text-center text-sm text-gray-600">
        Position QR code within view
      </div>
    </div>
  );
};

export default QrReader;
