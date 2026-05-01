import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const clerkUser = await currentUser();
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      _count: { select: { jobs: true, applications: true } },
      jobs: { orderBy: { postedAt: "desc" }, take: 3 },
      applications: {
        orderBy: { appliedAt: "desc" },
        take: 3,
        include: { job: true },
      },
    },
  });

  const displayName = user?.name ?? clerkUser?.fullName ?? "Account";
  const email =
    user?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? "";
  const avatarUrl = user?.image ?? clerkUser?.imageUrl ?? null;
  const memberSince = user?.createdAt ? formatDate(user.createdAt) : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-6 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl"
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="User avatar"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-slate-500">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  User dashboard
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                  {displayName}
                </h1>
                {email && (
                  <p className="mt-1 text-sm text-slate-600">{email}</p>
                )}
                {memberSince && (
                  <p className="mt-2 text-xs text-slate-500">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>

            {!user && (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                Your Clerk account is ready, but your profile has not been saved
                to the database yet.
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Jobs posted
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {user?._count.jobs ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Applications
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {user?._count.applications ?? 0}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent activity
              </h2>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Last 3
              </span>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Latest jobs
                </p>
                <div className="mt-3 space-y-3">
                  {user?.jobs.length ? (
                    user.jobs.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {job.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {job.company} • {job.location}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No job postings yet.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Latest applications
                </p>
                <div className="mt-3 space-y-3">
                  {user?.applications.length ? (
                    user.applications.map((application) => (
                      <div
                        key={application.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {application.job.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(application.appliedAt)} •{" "}
                          {application.status}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No applications yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
