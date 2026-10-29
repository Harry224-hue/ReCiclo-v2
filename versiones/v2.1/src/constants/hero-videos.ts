export interface HeroVideoOption {
    id: string;
    name: string;
    description: string;
    src: string;
}

export const CLOUDINARY_HERO_BASE = "https://res.cloudinary.com/a4nqiveg/video/upload/q_auto,f_auto";

export const DEFAULT_HERO_VIDEOS: HeroVideoOption[] = [
    {
        id: "video-1",
        name: "Video 1 (Original)",
        description: "Video original en alta definición (Cloudinary CDN)",
        src: `${CLOUDINARY_HERO_BASE}/video-hero.mp4`,
    },
    {
        id: "video-2",
        name: "Video 2",
        description: "Segundo video optimizado (Cloudinary CDN)",
        src: `${CLOUDINARY_HERO_BASE}/video-hero-2.mp4`,
    },
    {
        id: "video-3",
        name: "Video 3",
        description: "Tercer video optimizado (Cloudinary CDN)",
        src: `${CLOUDINARY_HERO_BASE}/video-hero-3.mp4`,
    },
    {
        id: "video-4",
        name: "Video 4",
        description: "Cuarto video optimizado (Cloudinary CDN)",
        src: `${CLOUDINARY_HERO_BASE}/video-hero-4.mp4`,
    },
    {
        id: "video-5",
        name: "Video 5",
        description: "Quinto video optimizado (Cloudinary CDN)",
        src: `${CLOUDINARY_HERO_BASE}/video-hero-5.mp4`,
    },
];
