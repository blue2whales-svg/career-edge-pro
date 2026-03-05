import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-background">CE</span>
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start your unfair advantage today</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-muted/50" />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-muted/50" />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-muted/50" />
          <Link to="/dashboard">
            <Button className="w-full bg-gradient-brand border-0 h-11 font-semibold mt-2">
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
