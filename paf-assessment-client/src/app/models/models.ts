export interface Song {
    id: number;
    title: string;
    name: string;
    code: string;
    listen_slots: number;
    available_slots: number;
}

export interface Listen {
    id: number;
    title: string;
    country: string;
    code: string;
    available: boolean;
}
