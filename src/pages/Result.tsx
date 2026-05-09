import { useEffect, useState } from "react";
import { ChevronLeft, RotateCcw, Share2 } from "lucide-react";
import PlanRenderer from "../components/PlanRenderer";

export default function WorkoutResult({ onBack, onNewWorkout }: any) {
  const [hydratedPlan, setHydratedPlan] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("fitforge:lastWorkout");
      if (raw) setHydratedPlan(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const planToRender = hydratedPlan;

  const handleShare = async () => {
    const text = (() => {
      if (!planToRender) return "FitForge plan";
      if (planToRender.plan_type === "weekly") {
        return `Weekly plan • ${planToRender.days_per_week} days/week`;
      }
      if (planToRender.plan_type === "monthly_progressive") {
        return `Monthly plan • Week count: ${planToRender.weeks?.length ?? 4}`;
      }
      return `${planToRender.day} — ${planToRender.focus} • ${planToRender.total_duration} min`;
    })();

    if (navigator.share) await navigator.share({ title: "FitForge", text });
    else await navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F2F2F2" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      <div
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #1F1F1F",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 54,
            padding: "0 16px",
          }}
        >
          <button
            onClick={onBack}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#111111",
              border: "1px solid #1F1F1F",
              cursor: "pointer",
              color: "#F2F2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#CBFF47" }}>
              FORGE
            </div>
            <div style={{ fontSize: 9, color: "#666" }}>
              {planToRender?.day ?? planToRender?.plan_type ?? "Plan"}
            </div>
          </div>

          <button
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
              borderRadius: 20,
              background: "rgba(203,255,71,0.07)",
              border: "1px solid rgba(203,255,71,0.25)",
              cursor: "pointer",
              color: "#CBFF47",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            <Share2 size={11} /> Share
          </button>
        </div>
      </div>

      <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
        {planToRender ? (
          <PlanRenderer plan={planToRender} />
        ) : (
          <div style={{ color: "#666", padding: "40px 0", textAlign: "center" }}>
            No plan found. Go back and generate one.
          </div>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px 28px",
          background: "linear-gradient(to top, #080808 60%, transparent)",
          pointerEvents: "none",
        }}
      >
        <button
          onClick={onNewWorkout}
          style={{
            width: "100%",
            height: 54,
            background: "#CBFF47",
            border: "none",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "0.1em",
            color: "#000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            pointerEvents: "all",
          }}
        >
          <RotateCcw size={14} /> Generate New Workout
        </button>
      </div>
    </div>
  );
}

