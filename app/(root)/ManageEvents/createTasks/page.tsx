
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTask, TaskStep } from "@/lib/tasks";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [steps, setSteps] = useState<TaskStep[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ADD STEP
  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        completed: false,
      },
    ]);
  };

  // UPDATE STEP
  const updateStep = (id: string, value: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? { ...step, title: value }
          : step
      )
    );
  };

  // REMOVE STEP
  const removeStep = (id: string) => {
    setSteps((prev) =>
      prev.filter((step) => step.id !== id)
    );
  };

  // CREATE TASK
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!deadline) {
      setError("Please select a deadline.");
      return;
    }

    if (steps.length === 0) {
      setError("Please add at least one task step.");
      return;
    }

    if (steps.some((step) => !step.title.trim())) {
      setError("Please fill out all task steps.");
      return;
    }

    try {
      setLoading(true);

      await createTask({
        title: title.trim(),
        deadline,
        steps: steps.map((step) => ({
          ...step,
          title: step.title.trim(),
          completed: false,
        })),
      });

      router.push("/tasks");
      router.refresh();

    } catch (error) {
      console.error("Create task error:", error);
      setError("Something went wrong while creating your task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111] p-6">

      <div className="max-w-3xl mx-auto">

        {/* BACK BUTTON */}
        <Link
          href="/ManageEvents"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white mb-8 transition"
        >
          <ArrowLeft size={18} />
          Back to Tasks
        </Link>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Task
          </h1>

          <p className="text-gray-500 mt-2">
            Organize your goals by breaking them into manageable steps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TASK INFORMATION */}
          <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-5">

            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
              Task Information
            </h2>

            {/* TITLE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Title
              </label>

              <input
                type="text"
                placeholder="Example: Website Redesign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DEADLINE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deadline
              </label>

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* TASK STEPS */}
          <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-5">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Task Steps
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Break your task into smaller steps.
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {steps.length} steps
              </span>
            </div>

            {/* DYNAMIC STEPS */}
            <div className="space-y-3">

              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3"
                >

                  {/* STEP NUMBER */}
                  <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#303030] text-sm font-medium text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </div>

                  {/* STEP INPUT */}
                  <input
                    type="text"
                    placeholder={`Step ${index + 1}`}
                    value={step.title}
                    onChange={(e) =>
                      updateStep(step.id, e.target.value)
                    }
                    className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* REMOVE STEP */}
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="p-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    aria-label={`Remove step ${index + 1}`}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              ))}

            </div>

            {/* ADD STEP */}
            <button
              type="button"
              onClick={addStep}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg py-3 text-sm font-medium text-gray-500 hover:text-blue-500 hover:border-blue-500 transition"
            >
              <Plus size={18} />
              Add Another Step
            </button>

          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <div className="flex justify-end gap-3">

            <Link
              href="/tasks"
              className="px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Task
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
