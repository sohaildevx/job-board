"use client";

import { useEffect, useState } from "react";
import { Briefcase, Clock, FileText, Globe, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
}

const categories = [
  { label: "Full-time", icon: Briefcase, color: "bg-blue-50 text-blue-600 ring-blue-200", hover: "hover:bg-blue-100" },
  { label: "Part-time", icon: Clock, color: "bg-purple-50 text-purple-600 ring-purple-200", hover: "hover:bg-purple-100" },
  { label: "Contract", icon: FileText, color: "bg-orange-50 text-orange-600 ring-orange-200", hover: "hover:bg-orange-100" },
  { label: "Remote", icon: Globe, color: "bg-green-50 text-green-600 ring-green-200", hover: "hover:bg-green-100" },
  { label: "Internship", icon: GraduationCap, color: "bg-yellow-50 text-yellow-600 ring-yellow-200", hover: "hover:bg-yellow-100" },
];

export default function Home() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setRecentJobs(data.slice(0, 6));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <div>
     
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Find Your Next <span className="text-blue-600">Dream Job</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
          Browse hundreds of job opportunities from top companies. Whether
          you&apos;re looking for full-time, remote, or contract work &mdash;
          it&apos;s all here.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/jobs">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Browse Jobs
            </button>
          </Link>
          <Link href="/jobs/post">
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Post a Job
            </button>
          </Link>
        </div>
      </section>

      
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
          <p className="text-gray-500">Find the job that fits your lifestyle</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.label} href={`/jobs?type=${cat.label}`}>
                <div
                  className={`${cat.color} ring-1 ${cat.hover} rounded-2xl p-6 text-center transition-all cursor-pointer group`}
                >
                  <div className="w-14 h-14 mx-auto bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <p className="font-semibold mt-3">{cat.label}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Jobs</h2>
          <Link href="/jobs" className="text-blue-600 hover:underline font-medium">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">No jobs posted yet</p>
            <Link href="/jobs/post">
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Post the First Job
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p className="text-gray-600 mt-1">
                  {job.company} &middot; {job.location}
                </p>
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {job.type}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(job.postedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
