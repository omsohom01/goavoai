"use client";

import { useState } from "react";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeView } from "@mui/x-date-pickers/models";
import moment from "moment";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

// Custom theme to match the website's emerald and slate aesthetic
const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // Emerald 500
      contrastText: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#64748b", // Slate 500
    },
  },
});

type TimePickerUIProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export default function TimePickerUI({ value, onChange }: TimePickerUIProps) {
  const [view, setView] = useState<TimeView>("hours");

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <div className="w-full max-w-[320px] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-emerald-900/10">
            <StaticTimePicker
              value={moment(value)}
              view={view}
              onViewChange={(newView) => setView(newView)}
              onChange={(newValue) => {
                if (newValue) {
                  onChange(newValue.toDate());
                }
              }}
              slotProps={{
                actionBar: {
                  actions: [], // This removes the "OK" and "Cancel" buttons
                },
                toolbar: {
                  hidden: false,
                },
              }}
              sx={{
                "& .MuiClock-root": {
                  backgroundColor: "#f8fafc",
                  borderRadius: "1rem",
                  margin: "1rem",
                },
                "& .MuiClockNumber-root": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                },
                "& .MuiClockPointer-root, & .MuiClockPointer-thumb": {
                  boxSizing: "content-box",
                },
              }}
              views={["hours", "minutes"]}
            />
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

