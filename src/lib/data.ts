export interface ArtistProject {
  id: string;
  artist: string;
  tagline: string;
  type: "concert" | "music-video" | "documentary" | "event";
  cover: string;
  images: string[];
  video?: string;
  year: string;
  featured?: boolean;
}

export const artists: ArtistProject[] = [
  {
    id: "chaar-diwari",
    artist: "Chaar Diwari",
    tagline: "x BITS Goa — Raw energy, untamed sound",
    type: "concert",
    cover: "/work/chaar-diwari/1.jpg",
    images: [
      "/work/chaar-diwari/1.jpg",
      "/work/chaar-diwari/2.jpg",
      "/work/chaar-diwari/3.jpg",
    ],
    video: "/videos/chaar-diwari-bits-goa.mp4",
    year: "2025",
    featured: true,
  },
  {
    id: "sunidhi-chauhan",
    artist: "Sunidhi Chauhan",
    tagline: "The queen of stage — power, grace, and everything in between",
    type: "concert",
    cover: "/work/sunidhi-chauhan/1.jpg",
    images: [
      "/work/sunidhi-chauhan/1.jpg",
      "/work/sunidhi-chauhan/2.jpg",
      "/work/sunidhi-chauhan/3.jpg",
      "/work/sunidhi-chauhan/4.jpg",
      "/work/sunidhi-chauhan/5.jpg",
      "/work/sunidhi-chauhan/6.jpg",
      "/work/sunidhi-chauhan/7.jpg",
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
    featured: true,
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
    id: "daman-documentary",
    artist: "Daman Documentary",
    tagline: "A visual love letter to the coastal town",
    type: "documentary",
    cover: "/work/ravator/3.jpg",
    images: ["/work/ravator/3.jpg", "/work/ravator/4.jpg"],
    video: "/videos/daman-documentary.mp4",
    year: "2025",
  },
];
