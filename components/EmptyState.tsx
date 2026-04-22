type EmptyStateProps = {
  title: string;
  body: string;
};

export default function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="panel p-10 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{body}</p>
    </div>
  );
}
