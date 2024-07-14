export interface Geoname {
    name: string;
    country: string;
    lat: number;
    lon: number;
    population?: number;
    timezone?: string;
    status: string;
}