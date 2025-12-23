"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Eye, Copy, Check } from "lucide-react";
import { Table } from "../types";
import QRCodeStyling from "qr-code-styling";

export default function QrDialog({
  open,
  setOpen,
  table,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  table: Table | null;
}) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate the menu URL for this table
  const menuUrl = table ? `${window.location.origin}/menu/${table.id}` : "";

  useEffect(() => {
    if (!table || !qrRef.current) return;

    // Clean up previous QR code
    if (qrCodeRef.current) {
      qrRef.current.innerHTML = "";
    }

    // Create new QR code with custom styling
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: menuUrl,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H",
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
      },
      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        color: "#C84501", // Scan2Dish brand color
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#C84501",
        type: "dot",
      },
    });

    qrCodeRef.current = qrCode;
    qrCode.append(qrRef.current);
  }, [table, menuUrl]);

  const handleDownload = () => {
    if (!qrCodeRef.current || !table) return;
    qrCodeRef.current.download({
      name: `table-${table.number}-qr`,
      extension: "png",
    });
  };

  const handleCopyLink = async () => {
    if (!menuUrl) return;
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePreview = () => {
    if (!menuUrl) return;
    window.open(menuUrl, "_blank");
  };

  if (!table) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Table {table.number} QR Code</DialogTitle>
          <DialogDescription>Customers scan this to access your menu.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 space-y-4">
          {/* QR Code Canvas */}
          <div ref={qrRef} className="bg-white p-4 rounded-lg border-2 border-gray-200" />

          {/* Stats */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Scanned {table.qrScans} times
            </p>
          </div>

          {/* URL Display */}
          <div className="w-full">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <code className="text-xs flex-1 truncate">{menuUrl}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Download PNG
          </Button>

          <Button variant="outline" onClick={handleCopyLink}>
            <Share2 className="h-4 w-4 mr-2" /> Copy Link
          </Button>

          <Button onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" /> Preview Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
