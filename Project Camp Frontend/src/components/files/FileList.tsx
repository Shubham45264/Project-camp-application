import { FileIcon, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectFile {
  _id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: {
    _id: string;
    username: string;
    fullName: string;
  };
  createdAt: string;
}

interface FileListProps {
  files: ProjectFile[];
  onDelete: (fileId: string) => void;
}

const FileList = ({ files, onDelete }: FileListProps) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No files uploaded yet.
      </div>
    );
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <div
          key={file._id}
          className="bg-card border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-md">
              <FileIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex gap-2">
              <a
                href={`http://localhost:8000${file.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(file._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              by {file.uploadedBy.fullName || file.uploadedBy.username}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
