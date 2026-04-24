"use client";

import dynamic from "next/dynamic";
import noResultAnimation from "@/public/Animations/No_Result_Found.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type EmptyStateProps = {
  title: string;
  body: string;
};

export default function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="bg-transparent p-0 text-center flex flex-col items-center justify-center">

      <div className="w-64 h-64 mb-0 opacity-80">
        <Lottie animationData={noResultAnimation} loop={false} />
      </div>
      <h3 className="font-clash text-2xl font-semibold text-slate-900 tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">{body}</p>
    </div>
  );
}
