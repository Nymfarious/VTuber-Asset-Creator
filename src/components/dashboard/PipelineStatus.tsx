import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Sparkles, Loader2 } from "lucide-react";

// Mock pipeline jobs
const mockJobs = [
  {
    id: "1",
    name: "Purple Cat Girl VTuber Pack",
    status: "completed",
    progress: 100,
    currentStage: "Export Preparation",
    startedAt: "2024-01-15 14:30",
    completedAt: "2024-01-15 14:45",
  },
  {
    id: "2",
    name: "Blue Fox Character Set",
    status: "processing",
    progress: 65,
    currentStage: "Expression Generation",
    startedAt: "2024-01-20 10:15",
    completedAt: null,
  },
];

export const PipelineStatus = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Pipeline Jobs</h3>
        <p className="text-sm text-muted-foreground">
          Monitor AI processing status and progress
        </p>
      </div>

      <div className="space-y-4">
        {mockJobs.map((job) => (
          <Card key={job.id} className="p-6 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    job.status === "completed"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-gradient-primary shadow-glow"
                  }`}
                >
                  {job.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{job.name}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {job.currentStage}
                  </p>
                </div>
              </div>
              <Badge
                variant={job.status === "completed" ? "default" : "secondary"}
                className={
                  job.status === "completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : ""
                }
              >
                {job.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Started: {job.startedAt}</span>
              </div>
              {job.completedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed: {job.completedAt}</span>
                </div>
              )}
            </div>
          </Card>
        ))}

        {mockJobs.length === 0 && (
          <Card className="p-12 text-center shadow-card">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No active pipeline jobs</h3>
              <p className="text-muted-foreground">
                Upload a character image to start processing
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
