"use client";

import { useRouter } from "next/navigation";
import { Joyride, type Step, type Styles, STATUS, type EventData, type Options, type PartialDeep, ACTIONS, EVENTS } from "react-joyride";
import { useTour } from "./TourProvider";
import { 
  Sparkles, 
  PartyPopper, 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Plus, 
  Rocket, 
  Paintbrush,
  Info
} from "lucide-react";

const joyrideSteps: Step[] = [
  {
    target: "body",
    content: (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
          <PartyPopper className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">Welcome to Evexa!</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          You're about to discover the most powerful event management platform. Let's take a quick tour of your new dashboard.
        </p>
      </div>
    ),
    placement: "center",
    skipBeacon: true,
  },
  {
    target: "[data-tour='navbar-logo']",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Home className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Return Home</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Click the logo anytime to return to your public homepage.
        </p>
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='navbar-events']",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Calendar className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Events Hub</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          View and manage all your events in one beautiful dashboard.
        </p>
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='navbar-attendees']",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Users className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Attendees</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Track registrations and manage your guest list effortlessly from here.
        </p>
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='navbar-messaging']",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <MessageSquare className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Messaging</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Communicate with your attendees directly via WhatsApp for high engagement.
        </p>
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='dashboard-heading']",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Info className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Command Center</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          This is your command center where all your upcoming events will appear.
        </p>
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='new-event-btn']",
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
            <Plus className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Create Event</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Ready to launch? Click 'New Event' to start the creation process.
        </p>
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
    blockTargetInteraction: false,
  },
  {
    target: '[data-tour="template-scratch"]',
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Paintbrush className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Start from Scratch</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          While we offer beautiful templates, you can always <strong>start from scratch</strong> for a completely custom experience.
        </p>
      </div>
    ),
    placement: "top",
    skipBeacon: true,
    blockTargetInteraction: false,
  },
  {
    target: '[data-tour="event-details"]',
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">Event Details</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Tell the world about your event. Use premium typography and layouts to capture attention.
        </p>
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: '[data-tour="enhance-ai"]',
    content: (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-emerald-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900">AI Magic</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Not a writer? Just type a simple line and tap <strong>Enhance with AI</strong>. We'll turn it into a professional, engaging description in seconds!
        </p>
      </div>
    ),
    placement: "top",
    skipBeacon: true,
  },
  {
    target: "body",
    content: (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
          <Rocket className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">You're All Set!</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          You've mastered the basics. Go ahead and create something amazing. We're here to help you grow your community.
        </p>
      </div>
    ),
    placement: "center",
    skipBeacon: true,
  },
];

const joyrideOptions: Partial<Options> = {
  primaryColor: "#10b981",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  overlayColor: "rgba(15, 23, 42, 0.65)",
  zIndex: 9999,
  arrowColor: "#ffffff",
  width: 360,
  spotlightRadius: 16,
  showProgress: true,
  scrollOffset: 120,
  buttons: ["back", "close", "primary", "skip"],
  arrowSize: 10,
  arrowBase: 16,
  targetWaitTimeout: 5000,
};

const joyrideStyles: PartialDeep<Styles> = {
  tooltip: {
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(148, 163, 184, 0.1)",
    fontFamily: '"ClashDisplay-Variable", system-ui, sans-serif',
  },
  tooltipTitle: {
    display: "none",
  },
  buttonPrimary: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderRadius: "100px",
    fontFamily: '"ClashDisplay-Variable", system-ui, sans-serif',
    fontSize: "13px",
    fontWeight: "700",
    padding: "10px 20px",
    letterSpacing: "0.02em",
    transition: "background-color 0.2s",
  },
  buttonBack: {
    color: "#64748b",
    fontFamily: '"ClashDisplay-Variable", system-ui, sans-serif',
    fontSize: "13px",
    fontWeight: "600",
    marginRight: "8px",
  },
  buttonSkip: {
    color: "#94a3b8",
    fontFamily: '"ClashDisplay-Variable", system-ui, sans-serif',
    fontSize: "12px",
  },
  buttonClose: {
    color: "#94a3b8",
    top: "14px",
    right: "14px",
  },
  tooltipFooter: {
    marginTop: "20px",
  },
};

export default function EvexaTour() {
  const { runTour, endTour } = useTour();
  const router = useRouter();

  function handleJoyrideCallback(data: EventData) {
    const { status, action, index, type } = data;
    
    // Auto-navigate to New Event page when clicking "Next" on the create step
    if (type === EVENTS.STEP_AFTER && index === 6 && action === ACTIONS.NEXT) {
      router.push("/dashboard/events/new");
    }

    // Auto-select "Blank Template" if clicking Next on template selection
    if (type === EVENTS.STEP_AFTER && index === 7 && action === ACTIONS.NEXT) {
      const scratchBtn = document.querySelector('[data-tour="template-scratch"]') as HTMLButtonElement;
      if (scratchBtn) {
        scratchBtn.click();
      }
    }

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem("evexa_tour_done", "true");
      endTour();
    }
  }

  return (
    <Joyride
      steps={joyrideSteps}
      run={runTour}
      continuous
      scrollToFirstStep
      onEvent={handleJoyrideCallback}
      options={joyrideOptions}
      styles={joyrideStyles}
      locale={{
        back: "← Back",
        close: "✕",
        last: "Launch Dashboard",
        next: "Next →",
        nextWithProgress: "Next ({current} of {total}) →",
        skip: "Skip tour",
      }}
    />
  );
}
