export default async function DashboardPage() {
  // Simulate a slow network request to trigger loading.tsx
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Dummy data
  const stats = [
    { label: "Total Revenue", value: "$45,231.89", trend: "+20.1% from last month" },
    { label: "Subscriptions", value: "+2350", trend: "+180.1% from last month" },
    { label: "Sales", value: "+12,234", trend: "+19% from last month" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
        <p className="text-slate-400">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-400">{stat.label}</span>
            <span className="text-3xl font-bold text-white">{stat.value}</span>
            <span className="text-xs text-indigo-400 mt-1">{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-6 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <p>Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
}
