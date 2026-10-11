export type ArtistType = "concert" | "music-video" | "documentary" | "event";

export interface ArtistProject {
  id: string;
  artist: string;
  tagline: string;
  type: ArtistType;
  cover: string;
  images: string[];
  video?: string;
  year: string;
  featured?: boolean;
}

export interface NavLink {
  name: string;
  href: string;
}

export type SocialIcon = "instagram" | "whatsapp" | "youtube" | "generic";

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface GearItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  specs: string[];
  image: string;
  imageW: number;
  imageH: number;
  span: string;
  link: string;
  accent: string;
  column: "left" | "right";
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  event: string;
}

export interface SiteContent {
  site: {
    title: string;
    description: string;
    ogImage: string;
  };
  nav: {
    brand: string;
    links: NavLink[];
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    paragraph: string;
    scrollHint: string;
    video: string;
    poster: string;
  };
  marquee: {
    items: string[];
  };
  work: {
    eyebrow: string;
    heading: string;
    featuredLabel: string;
    allProjectsLabel: string;
  };
  about: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    photo: string;
    photoAlt: string;
    name: string;
    subtitle: string;
    paragraphs: string[];
    ctaLabel: string;
  };
  gear: {
    eyebrow: string;
    heading: string;
    description: string;
    items: GearItem[];
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    backgroundImage: string;
    items: Testimonial[];
  };
  contact: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    paragraph: string;
    email: string;
    socials: SocialLink[];
    footerCopyright: string;
    footerCrafted: string;
    footerHeart: string;
    footerLocation: string;
  };
  preloader: {
    brand: string;
    bottomLeft: string;
    bottomRight: string;
  };
}

export const ARTIST_TYPES: { value: ArtistType; label: string }[] = [
  { value: "concert", label: "Concert" },
  { value: "music-video", label: "Music Video" },
  { value: "documentary", label: "Documentary" },
  { value: "event", label: "Event" },
];

export const defaultArtists: ArtistProject[] = [
  {
    id: "sunidhi-chauhan",
    artist: "Sunidhi Chauhan",
    tagline: "Vadodara 2025",
    type: "concert",
    cover: "/work/sunidhi-chauhan/3.jpg",
    images: [
      "/work/sunidhi-chauhan/1.jpg",
      "/work/sunidhi-chauhan/2.jpg",
      "/work/sunidhi-chauhan/3.jpg",
      "/work/sunidhi-chauhan/4.jpg",
      "/work/sunidhi-chauhan/5.jpg",
      "/work/sunidhi-chauhan/6.jpg",
      "/work/sunidhi-chauhan/7.jpg",
      "/work/sunidhi-chauhan/8.jpg",
      "/work/sunidhi-chauhan/9.jpg",
      "/work/sunidhi-chauhan/10.jpg",
    ],
    year: "2025",
    featured: true,
  },
  {
    id: "chaar-diwari",
    artist: "Chaar Diwari",
    tagline: "Spree — BITS Goa 2026",
    type: "concert",
    cover: "/work/chaar-diwari/1.jpg",
    images: [
      "/work/chaar-diwari/1.jpg",
      "/work/chaar-diwari/2.jpg",
      "/work/chaar-diwari/3.jpg",
    ],
    video: "/videos/chaar-diwari-bits-goa.mp4",
    year: "2026",
    featured: true,
  },
  {
    id: "seedhe-maut",
    artist: "Seedhe Maut",
    tagline: "Spree — BITS Goa 2025",
    type: "concert",
    cover: "/work/seedhe-maut/1.jpg",
    images: [
      "/work/seedhe-maut/1.jpg",
      "/work/seedhe-maut/2.jpg",
      "/work/seedhe-maut/3.jpg",
      "/work/seedhe-maut/4.jpg",
    ],
    year: "2025",
    featured: true,
  },
  {
    id: "badshah",
    artist: "Badshah",
    tagline: "Lights, bass, and a sea of phones in the air",
    type: "concert",
    cover: "/work/badshah/1.jpg",
    images: [
      "/work/badshah/1.jpg",
      "/work/badshah/2.jpg",
      "/work/badshah/3.jpg",
    ],
    year: "2025",
  },
  {
    id: "aditya-rikhari",
    artist: "Aditya Rikhari",
    tagline: "Soulful melodies — intimate concert moments",
    type: "concert",
    cover: "/work/aditya-rikhari/1.jpg",
    images: ["/work/aditya-rikhari/1.jpg", "/work/aditya-rikhari/2.jpg"],
    year: "2025",
  },
  {
    id: "raftaar",
    artist: "Raftaar",
    tagline: "Speed and swagger — rap with unstoppable energy",
    type: "concert",
    cover: "/work/raftaar/1.jpg",
    images: [
      "/work/raftaar/1.jpg",
      "/work/raftaar/2.jpg",
      "/work/raftaar/3.jpg",
    ],
    year: "2025",
  },
  {
    id: "mc-square",
    artist: "MC Square",
    tagline: "Hip-hop energy — the mic drops and the crowd goes wild",
    type: "concert",
    cover: "/work/mc-square/1.jpg",
    images: [
      "/work/mc-square/1.jpg",
      "/work/mc-square/2.jpg",
      "/work/mc-square/3.jpg",
      "/work/mc-square/4.jpg",
    ],
    year: "2025",
  },
  {
    id: "ravator",
    artist: "Ravator",
    tagline: "Heavy riffs and relentless energy on stage",
    type: "concert",
    cover: "/work/ravator/1.jpg",
    images: [
      "/work/ravator/1.jpg",
      "/work/ravator/2.jpg",
      "/work/ravator/3.jpg",
      "/work/ravator/4.jpg",
      "/work/ravator/5.jpg",
      "/work/ravator/6.jpg",
    ],
    year: "2025",
  },
  {
    id: "firozi",
    artist: "Firozi",
    tagline: "Blue notes and warm nights — a musical journey",
    type: "concert",
    cover: "/work/firozi/1.jpg",
    images: [
      "/work/firozi/1.jpg",
      "/work/firozi/2.jpg",
      "/work/firozi/3.jpg",
      "/work/firozi/4.jpg",
      "/work/firozi/5.jpg",
    ],
    year: "2025",
  },
  {
    id: "kushagra",
    artist: "Kushagra",
    tagline: "Fresh sounds from the underground scene",
    type: "concert",
    cover: "/work/kushagra/1.jpg",
    images: [
      "/work/kushagra/1.jpg",
      "/work/kushagra/2.jpg",
      "/work/kushagra/3.jpg",
      "/work/kushagra/4.jpg",
    ],
    year: "2025",
  },
  {
    id: "aanchal-tyagi",
    artist: "Aanchal Tyagi",
    tagline: "Stage presence — commanding every note",
    type: "concert",
    cover: "/work/aanchal-tyagi/1.jpg",
    images: [
      "/work/aanchal-tyagi/1.jpg",
      "/work/aanchal-tyagi/2.jpg",
      "/work/aanchal-tyagi/3.jpg",
      "/work/aanchal-tyagi/4.jpg",
    ],
    year: "2025",
  },
  {
    id: "wish",
    artist: "Wish",
    tagline: "One frame, infinite emotion — a visual storyteller",
    type: "concert",
    cover: "/work/wish/1.jpg",
    images: ["/work/wish/1.jpg"],
    year: "2025",
  },
  {
    id: "zakir-khan",
    artist: "Zakir Khan",
    tagline: "Storytelling with soul — comedy meets connection",
    type: "concert",
    cover: "/work/zakir-khan/1.jpg",
    images: [
      "/work/zakir-khan/1.jpg",
      "/work/zakir-khan/2.jpg",
      "/work/zakir-khan/3.jpg",
    ],
    year: "2025",
  },
];

export const defaultContent: SiteContent = {
  site: {
    title: "SCOTT — Photography & Cinematography",
    description:
      "Portfolio of Scott (Karan Pugalia) — Photographer & Cinematographer from Vadodara, India. Specializing in concert photography, music videos, and event coverage.",
    ogImage: "/scott.jpeg",
  },
  nav: {
    brand: "SCOTT",
    links: [
      { name: "Work", href: "#work" },
      { name: "About", href: "#about" },
      { name: "Gear", href: "#gear" },
      { name: "Contact", href: "#contact" },
    ],
  },
  hero: {
    eyebrow: "Photography & Cinematography",
    titleLine1: "SCOTT",
    titleLine2: "VISUALS",
    paragraph:
      "Capturing raw emotions through the lens — from electrifying concerts to intimate portraits. Based in Vadodara, creating across India.",
    scrollHint: "Scroll to explore",
    video: "/videos/chaar-diwari-bits-goa.mp4",
    poster: "/work/chaar-diwari/1.jpg",
  },
  marquee: {
    items: [
      "CONCERTS",
      "PORTRAITS",
      "MUSIC VIDEOS",
      "EVENTS",
      "ARTIST TOURS",
      "LIVE MUSIC",
    ],
  },
  work: {
    eyebrow: "Selected Work",
    heading: "Artists & Events",
    featuredLabel: "Featured",
    allProjectsLabel: "All Projects",
  },
  about: {
    eyebrow: "About",
    headingLine1: "The Story Behind",
    headingLine2: "the Lens",
    photo: "/scott.jpeg",
    photoAlt: "Scott — Karan Pugalia",
    name: "Scott.",
    subtitle: "Karan Pugalia — Vadodara, India",
    paragraphs: [
      'My journey began in <span class="text-[#ededed] font-medium">Class 9</span> with nothing more than a <span class="text-[#c8ff00]">mobile phone</span> — photographing the streets of Vadodara and learning composition, light, and storytelling.',
      'This passion evolved into work with cafés and local businesses, and before completing Class 12, I joined film school — where I discovered my strongest interest in <em class="text-[#c8ff00] not-italic font-medium">concerts, live events, and artists</em>.',
      "Over 4–5 years of consistent work, I kept investing in my craft and saving from my own earnings — eventually purchasing my first professional camera entirely through my own work.",
      'From a mobile phone to professional cinema equipment — driven by one thing: <em class="text-[#c8ff00] not-italic">the desire to create</em>.',
    ],
    ctaLabel: "Let's Collaborate",
  },
  gear: {
    eyebrow: "Arsenal",
    heading: "The Gear",
    description:
      "Tools of the trade. Every piece chosen for reliability, quality, and the ability to perform when it matters most.",
    items: [
      {
        id: "fx3",
        name: "Sony FX3",
        category: "Camera Body",
        tagline: "The Cinema Line workhorse",
        description:
          "Full-frame sensor, 4K 120fps, S-Log3. Built for run-and-gun filmmaking with cinema-grade internals in a compact body.",
        specs: [
          "Full-Frame 10.2MP",
          "4K 120fps",
          "S-Log3 / S-Cinetone",
          "Dual Card Slots",
        ],
        image: "/gear/sony-fx3.png",
        imageW: 900,
        imageH: 600,
        span: "",
        link: "https://electronics.sony.com/imaging/camcorders/all-camcorders/p/ilme-fx3",
        accent: "#c8ff00",
        column: "left",
      },
      {
        id: "2470",
        name: "FE 24-70mm f/2.8 GM II",
        category: "Lens",
        tagline: "The versatile king of glass",
        description:
          "From wide concert shots to tight artist portraits — razor-sharp optics with buttery bokeh.",
        specs: ["f/2.8 Constant", "Nano AR Coating II", "XD Linear Motors", "695g"],
        image: "/gear/sony-2470gm.png",
        imageW: 650,
        imageH: 400,
        span: "",
        link: "https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel2470gm2",
        accent: "#ff6b35",
        column: "left",
      },
      {
        id: "insta360",
        name: "Insta360 X3",
        category: "360° Action Camera",
        tagline: "Capture everything, reframe later",
        description:
          "360-degree capture means I never miss a moment. Shoot first, choose the angle in post.",
        specs: ["5.7K 360°", "72MP Photos", "FlowState", "Waterproof 10m"],
        image: "/gear/insta360-x3.png",
        imageW: 450,
        imageH: 450,
        span: "",
        link: "https://www.insta360.com/product/insta360-x3",
        accent: "#a855f7",
        column: "left",
      },
      {
        id: "handycam",
        name: "Handycam",
        category: "Camcorder",
        tagline: "Always ready to roll",
        description:
          "Captures behind-the-scenes moments, b-roll, and spontaneous footage on the go.",
        specs: ["Optical Zoom", "SteadyShot", "NightShot Plus", "Compact"],
        image: "/gear/handycam.png",
        imageW: 550,
        imageH: 350,
        span: "",
        link: "https://electronics.sony.com/imaging/camcorders/all-camcorders/p/fdrax43a-b",
        accent: "#f43f5e",
        column: "left",
      },
      {
        id: "rs5",
        name: "DJI RS 5 Combo",
        category: "Gimbal Stabilizer",
        tagline: "Buttery smooth motion",
        description:
          "3-axis stabilization that turns shaky handheld footage into cinema-grade steady shots.",
        specs: [
          "3-Axis Stabilization",
          "2.5kg Payload",
          "Focus Motor",
          "1Hr Full Charge",
        ],
        image: "/gear/dji-rs5.png",
        imageW: 350,
        imageH: 550,
        span: "",
        link: "https://store.dji.com/product/dji-rs-5",
        accent: "#00d4ff",
        column: "right",
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    heading: "Words That Matter",
    backgroundImage: "/work/seedhe-maut/3.jpg",
    items: [
      {
        id: "t1",
        quote:
          "The photos were amazing, the edits were really impressive, and the overall work was next level.",
        author: "Ravator",
        event: "Waves 2025",
      },
      {
        id: "t2",
        quote:
          "Bro, really good work. Loved the photos and the way you captured the moments.",
        author: "Dev Negi",
        event: "Manager",
      },
      {
        id: "t3",
        quote:
          "The video looks amazing, bro. You really understood the vibe and captured it perfectly. Great work.",
        author: "Chardiwari Team",
        event: "BITS Goa 2025",
      },
    ],
  },
  contact: {
    eyebrow: "Get in Touch",
    headingLine1: "Let's Create",
    headingLine2: "Something Together",
    paragraph:
      "Have a project in mind? Need coverage for your next event? Or just want to chat about photography? I'm always open to new collaborations and creative challenges.",
    email: "karanpugalia2@gmail.com",
    socials: [
      {
        id: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/scottt_73/",
        icon: "instagram",
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        href: "https://wa.me/919825335611",
        icon: "whatsapp",
      },
    ],
    footerCopyright: "© 2025 SCOTT. All rights reserved.",
    footerCrafted: "Crafted with",
    footerHeart: "♥",
    footerLocation: "from Vadodara, India",
  },
  preloader: {
    brand: "SCOTT",
    bottomLeft: "Photography & Cinematography",
    bottomRight: "Vadodara, India",
  },
};
