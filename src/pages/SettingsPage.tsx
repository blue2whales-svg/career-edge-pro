import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-8 max-w-[700px]">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and integrations.</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid gap-3">
          <Input placeholder="Full name" defaultValue="Demo User" className="bg-muted/50 border-border" />
          <Input placeholder="Email" defaultValue="demo@cvedge.com" className="bg-muted/50 border-border" />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="font-semibold">Zapier Webhooks</h2>
        <p className="text-sm text-muted-foreground">Enter your Zapier webhook URLs to enable automations.</p>
        <div className="grid gap-3">
          <Input placeholder="Follow-Up Emailer webhook URL" className="bg-muted/50 border-border font-mono text-sm" />
          <Input placeholder="Google Sheet Sync webhook URL" className="bg-muted/50 border-border font-mono text-sm" />
          <Input placeholder="Deadline Notifier webhook URL" className="bg-muted/50 border-border font-mono text-sm" />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="font-semibold">Subscription</h2>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Free Plan</div>
              <div className="text-sm text-muted-foreground">Unlimited applications · 5 AI generations/month</div>
            </div>
            <Button variant="outline" size="sm">Upgrade</Button>
          </div>
        </div>
      </div>

      <Button className="bg-gradient-brand border-0 font-medium">Save Changes</Button>
    </div>
  );
}
