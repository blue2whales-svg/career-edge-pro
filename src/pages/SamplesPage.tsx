import { Link } from "react-router-dom";

export default function SamplesPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">CV Templates</h1>
        <p className="text-muted-foreground mb-6">Our template library is coming soon.</p>
        <Link to="/cv-builder" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold">
          Build Your CV Now
        </Link>
      </div>
    </div>
  );
}
