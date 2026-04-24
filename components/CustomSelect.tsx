"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  name: string;
  defaultValue?: string;
  options: Option[];
  icon: React.ReactNode;
  label: string;
};

export default function CustomSelect({ name, defaultValue, options, icon, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0].value);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input type="hidden" name={name} value={selectedValue} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-4 rounded-full border border-slate-200 bg-white/50 px-6 py-4 text-left transition-[border-color,background-color] duration-200 hover:bg-white hover:border-slate-300 focus:border-emerald-500/50"
      >
        <div className="text-emerald-600">
          {icon}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
          <span className="truncate text-sm font-semibold text-slate-700">
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelectedValue(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                selectedValue === option.value 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {option.label}
              {selectedValue === option.value && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
