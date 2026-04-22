export type EventTemplate = {
  id: string;
  name: string;
  icon: string;
  description: string;
  titlePattern: string;
  descriptionTemplate: string;
  locationType: "online" | "offline";
  capacityDefault: number;
  rsvpModeDefault: "open" | "shortlisted";
  registrationMode: "free" | "paid";
};

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: "workshop",
    name: "Workshop",
    icon: "🎓",
    description: "Interactive learning session with limited capacity",
    titlePattern: "Workshop: {Topic}",
    descriptionTemplate:
      "Join us for an interactive workshop covering:\n\n• Overview of key concepts\n• Hands-on practice\n• Q&A session\n\nIdeal for professionals looking to upskill.",
    locationType: "offline",
    capacityDefault: 50,
    rsvpModeDefault: "shortlisted",
    registrationMode: "free",
  },
  {
    id: "webinar",
    name: "Webinar",
    icon: "🎥",
    description: "Online presentation for large audience",
    titlePattern: "Webinar: {Topic}",
    descriptionTemplate:
      "Join our exclusive webinar where industry experts will discuss:\n\n• Latest trends and insights\n• Case studies and best practices\n• Interactive Q&A\n\nRegistration is free. Attendees will receive the recording.",
    locationType: "online",
    capacityDefault: 500,
    rsvpModeDefault: "open",
    registrationMode: "free",
  },
  {
    id: "conference",
    name: "Conference",
    icon: "🎪",
    description: "Large-scale multi-track event",
    titlePattern: "{Year} {Topic} Conference",
    descriptionTemplate:
      "Join industry leaders at our annual conference featuring:\n\n• Keynote speeches\n• Multiple concurrent sessions\n• Networking opportunities\n• Expo and sponsors\n\nEarly bird registration now open!",
    locationType: "offline",
    capacityDefault: 1000,
    rsvpModeDefault: "shortlisted",
    registrationMode: "paid",
  },
  {
    id: "meetup",
    name: "Meetup",
    icon: "👥",
    description: "Casual community gathering",
    titlePattern: "{City} {Topic} Meetup",
    descriptionTemplate:
      "Come meet fellow enthusiasts in our community meetup!\n\n• Casual networking\n• Lightning talks\n• Refreshments provided\n• No experience necessary\n\nAll skill levels welcome!",
    locationType: "offline",
    capacityDefault: 80,
    rsvpModeDefault: "open",
    registrationMode: "free",
  },
  {
    id: "training",
    name: "Training Session",
    icon: "🏋️",
    description: "Structured training course with certification",
    titlePattern: "{Level} Training: {Topic}",
    descriptionTemplate:
      "Comprehensive training program designed for beginners and professionals:\n\n• 8-week structured curriculum\n• Hands-on projects\n• Mentorship included\n• Industry-recognized certification\n\nEnroll now to secure your spot!",
    locationType: "offline",
    capacityDefault: 30,
    rsvpModeDefault: "shortlisted",
    registrationMode: "paid",
  },
  {
    id: "networking",
    name: "Networking Event",
    icon: "🤝",
    description: "Professional networking opportunity",
    titlePattern: "{Industry} Networking Event",
    descriptionTemplate:
      "Connect with professionals in your field at our exclusive networking event:\n\n• Speed networking sessions\n• Industry speaker\n• Cocktails and appetizers\n• Business card exchange\n\nBring your best self and expand your network!",
    locationType: "offline",
    capacityDefault: 120,
    rsvpModeDefault: "open",
    registrationMode: "free",
  },
];
