import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "/images/qr-frame.svg";
import { useToast } from "../hooks/use-toast";

const QrReader = ({ onResult }) => {
  const { toast } = useToast();

  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);
    onResult(result?.data);
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      toast({
        title: "Camera is blocked or not accessible.",
        description:
          "Please allow camera in your browser permissions and Reload.",
        variant: "destructive",
      });
  }, [qrOn]);

  return (
    <div className="w-full h-[50%] flex flex-col items-center relative">
      <video ref={videoEl} className="w-[100%] h-[50%] object-cover"></video>
      <div ref={qrBoxEl} className="w-full absolute">
        <img
          src={QrFrame}
          alt="Qr Frame"
          className="absolute w-96 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
};

export default QrReader;
