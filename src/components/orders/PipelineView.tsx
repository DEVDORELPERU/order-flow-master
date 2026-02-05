import { STAGES } from "@/data/orders";
import { cn } from "@/lib/utils";

interface PipelineProps {
  countByStatus: Record<string, number>;
}

const stageColorClasses: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  capture: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  verification: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-500" },
  fulfillment: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-500" },
  shipping: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500" },
  postsale: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500" },
};

export function PipelineView({ countByStatus }: PipelineProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {STAGES.map((stage, i) => {
        const count = stage.statuses.reduce((sum, s) => sum + (countByStatus[s] || 0), 0);
        const colors = stageColorClasses[stage.id];

        return (
          <div
            key={stage.id}
            className={cn(
              "relative rounded-lg border p-4 animate-slide-in",
              colors.bg,
              colors.border
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{stage.icon}</span>
              <span className={cn("text-sm font-semibold", colors.text)}>{stage.name}</span>
            </div>
            <div className={cn("text-3xl font-bold tracking-tight", colors.text)}>{count}</div>
            <div className="text-xs text-muted-foreground mt-1">pedidos</div>

            {/* Status breakdown */}
            <div className="mt-3 space-y-1">
              {stage.statuses.map((s) => (
                <div key={s} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse-dot", colors.dot)} />
                    <span className="text-muted-foreground capitalize">
                      {s.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className={cn("font-medium", colors.text)}>{countByStatus[s] || 0}</span>
                </div>
              ))}
            </div>

            {/* Connector arrow */}
            {i < STAGES.length - 1 && (
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-lg z-10">
                →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
