import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadFileModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

const UploadFileModal = ({
  open,
  onClose,
  onUpload,
  isUploading = false,
}: UploadFileModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-96 border shadow-lg text-card-foreground">
        <h2 className="text-lg font-semibold mb-4">Upload File</h2>

        <div className="mb-4">
          <Input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
            className="cursor-pointer bg-background"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (file) {
                onUpload(file);
              }
            }}
            disabled={!file || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
