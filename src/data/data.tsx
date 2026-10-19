import React from "react";
import { ShieldCheck, MapPin, Handshake, Landmark, Headset } from "lucide-react";
import houseImage from "../assets/house.png";
import galleryImage1 from "../assets/galleryImage1.png";
import galleryImage2 from "../assets/galleryImage2.png";
import galleryImage3 from "../assets/galleryImage3.png";
import galleryImage4 from "../assets/galleryImage4.png";

export interface WhyChooseUsItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    image: string;
}

export const whyChooseUsData: WhyChooseUsItem[] = [
    {
        icon: <ShieldCheck className="size-5 text-zinc-600" />,
        title: "Verified Property Listings",
        description: "Access a curated database of verified, high-quality properties, ensuring transparency and security in every transaction.",
        image: houseImage
    },
    {
        icon: <MapPin className="size-5 text-zinc-600" />,
        title: "Expert Local Market Insights",
        description: "Make informed decisions with the help of our experienced agents who provide detailed analysis and neighborhood trends.",
        image: galleryImage1
    },
    {
        icon: <Handshake className="size-5 text-zinc-600" />,
        title: "Seamless Buying & Selling Process",
        description: "We guide you through every stage of your real estate transaction, from initial listing or search to final closing.",
        image: galleryImage2
    },
    {
        icon: <Landmark className="size-5 text-zinc-600" />,
        title: "Mortgage & Financing Support",
        description: "Find competitive financing options and custom mortgage structures through our network of trusted lending partners.",
        image: galleryImage3
    },
    {
        icon: <Headset className="size-5 text-zinc-600" />,
        title: "Dedicated Client Service",
        description: "Our team is available round-the-clock to address your questions and deliver personalized, professional support.",
        image: galleryImage4
    }
];

export interface TestimonialItem {
    name: string;
    location: string;
    avatar: string;
    text: string;
}

export const testimonialsCol1: TestimonialItem[] = [
    {
        name: "Michael Anderson",
        location: "Austin, Texas",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80",
        text: "The entire buying process was seamless. We found our dream home faster than expected."
    },
    {
        name: "Sarah Thompson",
        location: "Miami, Florida",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&h=120&q=80",
        text: "Professional, responsive, and incredibly knowledgeable. They helped us secure the perfect waterfront property."
    },
    {
        name: "Emma Rodriguez",
        location: "Barcelona, Spain",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=120&h=120&q=80",
        text: "From property tours to closing, everything was handled professionally. I couldn't have asked for experience."
    }
];

export const testimonialsCol2: TestimonialItem[] = [
    {
        name: "David Wilson",
        location: "Chicago, Illinois",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&h=120&q=80",
        text: "Their local market expertise made all the difference. We sold our home above asking price within days."
    },
    {
        name: "Daniel Kim",
        location: "Seoul, South Korea",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=120&h=120&q=80",
        text: "From property tours to closing, everything was handled professionally. I couldn't have asked for experience."
    },
    {
        name: "James Parker",
        location: "Denver, Colorado",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=120&h=120&q=80",
        text: "As a first-time homebuyer, I felt supported throughout the entire journey. Highly recommended."
    }
];
