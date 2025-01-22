import React, { useState } from "react";
import QRCode from "react-qr-code";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QRCodeDisplay = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "";
  const name = searchParams.get("name") || "";

  const [qrSize, setQrSize] = useState(256);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-lg min-h-screen pt-10">
      <div
        className="h-64 w-64"
        style={{ height: `${qrSize}px`, width: `${qrSize}px` }}
      >
        <QRCode
          value={code}
          size={qrSize}
          className="h-full w-full"
          viewBox="0 0 256 256"
        />
      </div>

      {name && <span className="text-black text-2xl font-bold">{name}</span>}

      <div className="print:hidden">
        <Select onValueChange={(value) => setQrSize(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select QR Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="128">128x128</SelectItem>
            <SelectItem value="256">256x256</SelectItem>
            <SelectItem value="512">512x512</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handlePrint}
        className="print:hidden"
        variant="secondary"
      >
        Print
      </Button>
    </div>
  );
};

export default QRCodeDisplay;
