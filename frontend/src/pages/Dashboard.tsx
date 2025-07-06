// src/pages/Dashboard.tsx (or wherever your test is)
export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="font-bold text-center">
        Tailwind CSS is working if you see this green box!
      </h1>

      {/* ✅ Green box */}
      <div className="w-32 h-32 bg-green-500 mt-4 mx-auto" />
    </div>
  );
}
