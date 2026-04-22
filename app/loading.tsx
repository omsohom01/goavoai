import LoadingState from "@/components/LoadingState";

export default function Loading() {
  return (
    <main className="gradient-shell flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <LoadingState label="Preparing your workspace..." />
      </div>
    </main>
  );
}
