import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AddMemberModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (email: string, role: "member" | "project_admin") => Promise<void>;
}

export const AddMemberModal = ({ open, onClose, onAdd }: AddMemberModalProps) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"member" | "project_admin">("member");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) return;
        setLoading(true);
        try {
            await onAdd(email, role);
            setEmail("");
            onClose();
        } catch (error) {
            console.error(error);
            // Parent handles alert
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Add a new member to this project. They will receive access immediately.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-background text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <select
                            className="w-full border rounded-md px-3 py-2 text-sm bg-background text-foreground"
                            value={role}
                            onChange={(e) => setRole(e.target.value as "member" | "project_admin")}
                        >
                            <option value="member">Member (Read & Comment)</option>
                            <option value="project_admin">Project Admin (Manage Tasks)</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!email.trim() || loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Invite
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
