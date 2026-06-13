"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function JobActions({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jobPostDelete?id=${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        title="Edit"
        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        title="Delete"
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
