"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  calculateGpa,
  convertCgpaToPercentage,
  generateCitation,
  calculateWeightedGrade,
  calculateAttendance,
  calculateExamScoreTarget,
  calculateStudyTimePlan,
  EducationEngineResult,
} from "@/lib/engines/education-engine";
import { GraduationCap, Copy, Check } from "lucide-react";

interface EducationWidgetProps {
  tool: ToolDefinition;
}

export function EducationWidget({ tool }: EducationWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  // GPA state
  const [courses, setCourses] = useState([
    { credits: 3, gradePoint: 4.0 },
    { credits: 4, gradePoint: 3.7 },
    { credits: 3, gradePoint: 3.3 },
    { credits: 3, gradePoint: 4.0 },
  ]);

  // CGPA state
  const [cgpa, setCgpa] = useState(8.4);
  const [scale, setScale] = useState<"10" | "4">("10");

  // Citation state
  const [style, setStyle] = useState<"APA" | "MLA" | "Chicago">("APA");
  const [author, setAuthor] = useState("Smith, J.");
  const [title, setTitle] = useState("Modern Web Architecture & Security");
  const [year, setYear] = useState("2024");
  const [publisher, setPublisher] = useState("Tech Press");
  const [url, setUrl] = useState("https://novatool.in");
  const [copied, setCopied] = useState(false);

  // Weighted grade state
  const [assignments, setAssignments] = useState([
    { name: "Homework & Assignments", score: 92, maxScore: 100, weightPercent: 20 },
    { name: "Midterm Exam", score: 85, maxScore: 100, weightPercent: 30 },
    { name: "Project / Presentation", score: 95, maxScore: 100, weightPercent: 20 },
    { name: "Final Examination", score: 88, maxScore: 100, weightPercent: 30 },
  ]);

  // Attendance state
  const [attended, setAttended] = useState(38);
  const [conducted, setConducted] = useState(48);
  const [reqPercent, setReqPercent] = useState(75);

  // Exam target state
  const [currentGrade, setCurrentGrade] = useState(82);
  const [desiredGrade, setDesiredGrade] = useState(90);
  const [examWeight, setExamWeight] = useState(35);

  // Study time planner state
  const [credits, setCredits] = useState(16);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  let result: EducationEngineResult = { success: false, formatted: "" };

  if (action === "calculate-gpa" || action === "gpa-calculator") {
    result = calculateGpa(courses);
  } else if (action === "cgpa-to-percentage" || action === "cgpa-to-percentage-converter") {
    result = convertCgpaToPercentage(cgpa, scale);
  } else if (action === "generate-citation" || action === "citation-generator") {
    result = generateCitation({ style, author, title, year, publisher, url });
  } else if (action === "weighted-grade" || action === "weighted-grade-calculator") {
    result = calculateWeightedGrade(assignments);
  } else if (action === "attendance-percentage" || action === "attendance-percentage-calculator") {
    result = calculateAttendance(attended, conducted, reqPercent);
  } else if (action === "exam-score-target" || action === "exam-score-target-calculator") {
    result = calculateExamScoreTarget(currentGrade, desiredGrade, examWeight);
  } else if (action === "study-time-planner" || action === "study-time-planner-calculator") {
    result = calculateStudyTimePlan(credits, difficulty, 5);
  }

  const handleCopy = async () => {
    if (!result.formatted) return;
    await navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Inputs</span>
          </div>

          {(action.includes("gpa-calculator") || action === "calculate-gpa") && (
            <div className="space-y-2">
              {courses.map((course, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">Course {idx + 1} Credits</label>
                    <input
                      type="number"
                      value={course.credits}
                      onChange={(e) => {
                        const updated = [...courses];
                        updated[idx].credits = Number(e.target.value);
                        setCourses(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Grade Point (0.0 - 4.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={course.gradePoint}
                      onChange={(e) => {
                        const updated = [...courses];
                        updated[idx].gradePoint = Number(e.target.value);
                        setCourses(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {action.includes("weighted-grade") && (
            <div className="space-y-3">
              {assignments.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-500">Your Score</label>
                      <input
                        type="number"
                        value={item.score}
                        onChange={(e) => {
                          const updated = [...assignments];
                          updated[idx].score = Number(e.target.value);
                          setAssignments(updated);
                        }}
                        className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500">Max Score</label>
                      <input
                        type="number"
                        value={item.maxScore}
                        onChange={(e) => {
                          const updated = [...assignments];
                          updated[idx].maxScore = Number(e.target.value);
                          setAssignments(updated);
                        }}
                        className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500">Weight (%)</label>
                      <input
                        type="number"
                        value={item.weightPercent}
                        onChange={(e) => {
                          const updated = [...assignments];
                          updated[idx].weightPercent = Number(e.target.value);
                          setAssignments(updated);
                        }}
                        className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {action.includes("attendance") && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Classes Attended</label>
                  <input
                    type="number"
                    value={attended}
                    onChange={(e) => setAttended(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Total Classes Conducted</label>
                  <input
                    type="number"
                    value={conducted}
                    onChange={(e) => setConducted(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Required Attendance Threshold (%)</label>
                <input
                  type="number"
                  value={reqPercent}
                  onChange={(e) => setReqPercent(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action.includes("exam-score") && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Current Grade (%)</label>
                  <input
                    type="number"
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Desired Final Grade (%)</label>
                  <input
                    type="number"
                    value={desiredGrade}
                    onChange={(e) => setDesiredGrade(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Final Exam Weight (% of Total Course)</label>
                <input
                  type="number"
                  value={examWeight}
                  onChange={(e) => setExamWeight(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action.includes("study-time") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Total Semester Credit Hours</label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Course Workload & Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "medium", "hard"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                        difficulty === d ? "bg-yellow-500 text-slate-950 font-bold" : "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {(action.includes("cgpa-to-percentage") || action === "cgpa-to-percentage") && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">CGPA Score</label>
                <input
                  type="number"
                  step="0.01"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Scale</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["10", "4"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScale(s)}
                      className={`py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        scale === s ? "bg-yellow-500 text-slate-950 font-bold" : "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {s}-Point Scale
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(action.includes("citation") || action === "generate-citation") && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {(["APA", "MLA", "Chicago"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStyle(st)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      style === st ? "bg-yellow-500 text-slate-950 font-bold" : "bg-slate-950 border border-slate-800 text-slate-300"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author (e.g. Smith, J.)"
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Year (e.g. 2024)"
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book / Article Title"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Publisher (Optional)"
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="URL (Optional)"
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-950/30 to-slate-900/80 border border-yellow-500/20 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">
              Academic Outcome
            </div>
            <div className="text-2xl font-extrabold text-white">
              {result.formatted || "—"}
            </div>
          </div>

          {(action.includes("citation") || action === "generate-citation") && result.formatted && (
            <button
              type="button"
              onClick={handleCopy}
              className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>Copy Citation</span>
            </button>
          )}

          {result.breakdown && (
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <dl className="space-y-1.5 text-xs">
                {Object.entries(result.breakdown).map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-slate-800/60">
                    <dt className="text-slate-400">{label}:</dt>
                    <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
