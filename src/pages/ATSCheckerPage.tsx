import { useState } from "react";

const SUPABASE_URL = "https://wspugvdwodqdlyamxzxj.supabase.co/functions/v1/ats-checker";
const SUPABASE_ANON_KEY = "sb_publishable_nhGjJgV7MxzzyZLkStxzIA_DXY-lMFS";

const gradeColor = (grade) => {
  if (grade === "A") return "text-green-500";
  if (grade === "B") return "text-blue-500";
  if (grade === "C") return "text-yellow-500";
  return "text-red-500";
};

const statusColor = (status) => {
  if (status === "good") return "bg-green-500";
  if (status === "warning") return "bg-yellow-500";
  return "bg-red-500";
};

export default function ATSCheckerPage() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!cvText.trim() || cvText.trim().length < 50) {
      setError("Please paste at least 50 characters of your CV.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ cvText, jobDescription }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">ATS Checker</h1>
      <p className="text-muted-foreground mb-6">
        Get an instant AI-powered ATS score for your CV — free, powered by Gemini.
      </p>

      <textarea
        className="w-full h-48 p-3 border rounded-lg mb-3 bg-background text-foreground text-sm"
        placeholder="Paste your full CV text here (minimum 50 characters)..."
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
      />

      <textarea
        className="w-full h-20 p-3 border rounded-lg mb-4 bg-background text-foreground text-sm"
        placeholder="(Optional) Paste the job description for a tailored match score..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? "Analyzing your CV..." : "Analyze My CV ✅"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">{error}</div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="p-6 border rounded-xl flex items-center gap-6">
            <div className="text-center">
              <div className="text-6xl font-black">{result.score}</div>
              <div className="text-sm text-muted-foreground">/100</div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-black ${gradeColor(result.grade)}`}>{result.grade}</div>
              <div className="text-sm text-muted-foreground">Grade</div>
            </div>
            <div className="flex-1">
  <p className="text-muted-foreground mb-4">{result.verdict}</p>
  
  {result.score >= 90 ? (
    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
      <p className="text-green-500 font-bold text-lg">🎉 Congratulations!</p>
      <p className="text-green-400 text-sm mt-1">
        Your CV is ATS-optimized and ready to impress recruiters. You're in the top tier!
      </p>
    </div>
  ) : (
    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <p className="text-yellow-500 font-bold text-lg">
        {result.score >= 70 ? "⚠️ Almost There!" : "❗ Needs Improvement"}
      </p>
      <p className="text-yellow-400 text-sm mt-2">
        {result.score >= 70
          ? "Your CV is good but missing some key elements. Fix these to stand out:"
          : "Your CV needs work before it passes ATS filters. Key issues:"}
      </p>
      <ul className="mt-2 space-y-1">
        {result.critical?.slice(0, 3).map((c, i) => (
          <li key={i} className="text-sm text-muted-foreground flex gap-2">
            <span className="text-yellow-500">→</span>
            {c.title}
          </li>
        ))}
      </ul>
      
        href="https://cvedge.live/optimize"
        className="mt-4 inline-block w-full text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-s
          </div>

          <div className="p-6 border rounded-xl">
            <h2 className="font-bold text-lg mb-4">Score Breakdown</h2>
            <div className="space-y-3">
              {result.metrics?.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{m.name}</span>
                    <span className="font-semibold">{m.score}/100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${statusColor(m.status)}`} style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.critical?.length > 0 && (
            <div className="p-6 border border-red-500/30 rounded-xl">
              <h2 className="font-bold text-lg mb-3 text-red-500">⚠️ Critical Issues</h2>
              <div className="space-y-3">
                {result.critical.map((c, i) => (
                  <div key={i}>
                    <div className="font-semibold text-sm">{c.title}</div>
                    <div className="text-muted-foreground text-sm">{c.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.improvements?.length > 0 && (
            <div className="p-6 border border-yellow-500/30 rounded-xl">
              <h2 className="font-bold text-lg mb-3 text-yellow-500">💡 Improvements</h2>
              <div className="space-y-3">
                {result.improvements.map((item, i) => (
                  <div key={i}>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-muted-foreground text-sm">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.strengths?.length > 0 && (
            <div className="p-6 border border-green-500/30 rounded-xl">
              <h2 className="font-bold text-lg mb-3 text-green-500">✅ Strengths</h2>
              <div className="space-y-3">
                {result.strengths.map((s, i) => (
                  <div key={i}>
                    <div className="font-semibold text-sm">{s.title}</div>
                    <div className="text-muted-foreground text-sm">{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 border rounded-xl">
            <h2 className="font-bold text-lg mb-3">🔑 Keywords</h2>
            <div className="mb-3">
              <div className="text-sm text-green-500 font-semibold mb-1">Found</div>
              <div className="flex flex-wrap gap-2">
                {result.keywords_found?.map((k, i) => (
                  <span key={i} className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-red-500 font-semibold mb-1">Missing</div>
              <div className="flex flex-wrap gap-2">
                {result.keywords_missing?.map((k, i) => (
                  <span key={i} className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
