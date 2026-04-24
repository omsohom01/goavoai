"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

export default function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Fill empty slots for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Fill current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const isSelected = (day: number) => 
    selectedDate.getDate() === day && 
    selectedDate.getMonth() === viewDate.getMonth() && 
    selectedDate.getFullYear() === viewDate.getFullYear();

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === viewDate.getMonth() && 
           today.getFullYear() === viewDate.getFullYear();
  };

  return (
    <div className="w-full max-w-[320px] rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-emerald-900/5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-2">
        <button 
          type="button"
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100 text-slate-400"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-clash text-lg font-bold text-slate-800">
          {monthName} {year}
        </h3>
        <button 
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100 text-slate-400"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="mb-4 grid grid-cols-7 text-center">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <span key={day} className="text-[10px] font-bold tracking-widest text-slate-400">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {days.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(viewDate);
                  newDate.setDate(day);
                  onDateChange(newDate);
                }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all
                  ${isSelected(day) 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                    : isToday(day)
                      ? "text-emerald-600 ring-2 ring-emerald-600/20"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }
                `}
              >
                {day}
                {isSelected(day) && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white opacity-40"></span>
                )}
              </button>
            ) : (
              <div className="h-10 w-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
