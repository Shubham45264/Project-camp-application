import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [mockLink, setMockLink] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            setIsLoading(true);
            const response = await api.post("/auth/forgot-password", { email });
            setIsSent(true);
            if (response?.data?.data?.mockLink) {
                setMockLink(response.data.data.mockLink);
            }
            toast.success("Reset link sent to your email!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
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
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground mt-2">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {isSent ? (
                    <div className="text-center space-y-4">
                        <div className="bg-green-500/10 text-green-500 p-4 rounded-lg">
                            Check your inbox! We have sent a password reset link to <strong>{email}</strong>.
                        </div>

                        {mockLink && (
                            <div className="bg-yellow-500/10 text-yellow-600 p-4 rounded-lg text-sm break-all">
                                <strong>Development Mode:</strong><br />
                                <a href={mockLink} className="underline" target="_blank" rel="noopener noreferrer">Click here to reset password</a>
                            </div>
                        )}

                        <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>
                            Try another email
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending Link..." : "Send Reset Link"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
