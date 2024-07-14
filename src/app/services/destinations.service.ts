import { Injectable } from '@angular/core';
import { Destination } from '../models/destination';

@Injectable({
  providedIn: 'root'
})
export class DestinationsService {

  private destinations: Destination[] = [
    {
      id: '1',
      name: 'Machu Picchu',
      country: 'Perú',
      photo: 'assets/images/MachuPicchu.jpg',
      tripCost: 500
    },
    {
      id: '2',
      name: 'Eiffel Tower',
      country: 'France',
      photo: 'assets/images/EiffelTower.jpg',
      tripCost: 700
    },  
    {
      id: '3',
      name: 'Santorini',
      country: 'Greece',
      photo: 'assets/images/Santorini.jpg',
      tripCost: 900
    },
    {
      id: '4',
      name: 'Great Wall of China',
      country: 'China',
      photo: 'assets/images/GreatWallofChina.jpg',
      tripCost: 790
    }
  ];
  
  constructor() {
    console.log('DestinationsService initialized with destinations:', this.destinations);
  }

  getDestinations(): Destination[] {
    console.log('Fetching destinations from service');
    return this.destinations;
  }

  addDestination(destination: Destination) {
    this.destinations.push(destination);
    console.log('Destination added:', destination);
  }

  removeDestination(destinationId: string) {
    this.destinations = this.destinations.filter(dest => dest.id !== destinationId);
    console.log('Destination removed. New destinations:', this.destinations);
  }

  updateTripCost(destinationId: string, newCost: number) {
    const index = this.destinations.findIndex(dest => dest.id === destinationId);
    if (index !== -1) {
      this.destinations[index].tripCost = newCost;
    }
  }
}