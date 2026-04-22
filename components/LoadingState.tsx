export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="panel p-8">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
      <p className="mt-4 text-sm text-slate-500">{label}</p>
    </div>
  );
}
