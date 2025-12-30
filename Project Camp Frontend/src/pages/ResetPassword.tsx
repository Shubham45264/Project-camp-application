import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/services/api";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !confirmPassword) return;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            await api.post(`/auth/reset-password/${token}`, { newPassword: password });
            toast.success("Password reset successfully! Login with new password.");
            navigate("/login");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to reset password. Link may be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border rounded-xl p-8 shadow-sm">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                <div className="text-center mb-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                        <Tent className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Set New Password</h1>
                    <p className="text-muted-foreground mt-2">
                        Create a new secure password for your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                className="pl-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
