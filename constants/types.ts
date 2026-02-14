export type PropertyType = 'Home' | 'Apartment' | 'Villa' | 'Commercial' | 'Land';
export type ListingType = 'Sell' | 'Rent';

export interface PropertyListing {
    id: string;
    userId: string;
    title: string;
    description: string;
    price: number;
    location: string;
    type: PropertyType;
    listingType: ListingType;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    area: string; // e.g. "1200 sqft" or "2 Acres"
    createdAt: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    listings: string[]; // Array of PropertyListing IDs
}
