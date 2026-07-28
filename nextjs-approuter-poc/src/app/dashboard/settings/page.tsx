export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-medium text-white">Profile</h3>
          <p className="text-sm text-slate-400">This is how others will see you on the site.</p>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Display Name</label>
            <input type="text" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" defaultValue="Jane Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input type="email" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" defaultValue="jane@example.com" />
          </div>
          <button className="self-start px-6 py-2 bg-white hover:bg-slate-200 text-black font-medium rounded-lg transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
