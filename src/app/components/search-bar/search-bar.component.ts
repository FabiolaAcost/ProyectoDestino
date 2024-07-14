import { DestinationsService } from './../../services/destinations.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonSearchbar, IonIcon, IonList, IonItem, IonLabel, IonSpinner, IonButton, IonImg } from '@ionic/angular/standalone';
import { OpenTripMapService } from 'src/app/services/open-trip-map.service';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { PlaceDetails } from 'src/app/models/ITravel';
import { CommonModule, NgIf } from '@angular/common';
import { addCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Destination } from '../../models/destination';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports:[IonSearchbar,IonButton,IonIcon,IonImg,IonList,IonItem,IonLabel,CommonModule,NgIf]
})
export class SearchBarComponent  implements OnInit {

  isLoading = false;
  placesDetails: PlaceDetails[] = [];
  selectedDestination?: Destination;

  constructor(private openTripService:OpenTripMapService,private changeDetector: ChangeDetectorRef,private destinationService:DestinationsService) { 
    addIcons({ addCircle});
  }

  ngOnInit() {
    console.log('Service instance:', this.openTripService);
  }
 
  handleInput(event: any) {
    const query = event.target.value.trim();
      this.isLoading = true;
      this.openTripService.getGeoname(query)
        .pipe(
          switchMap(geoname => {
            if (geoname && geoname.status === 'OK') {
              console.log('Geoname found:', geoname);
              return this.openTripService.getAutosuggest(query, geoname.lat, geoname.lon);
            } else {
              throw new Error('Geoname not found');
            }
          }),
          switchMap(suggestions => {
            console.log('Autosuggest suggestions:', suggestions); 
            if (suggestions && suggestions.length > 0) {
              const limitedSuggestions = suggestions.slice(0, 3);
              return forkJoin(limitedSuggestions.map((suggestion: { xid: string; }) =>
                this.openTripService.getPlaceDetails(suggestion.xid)
              ));
            } else {
              throw new Error('No suggestions found');
            }
          }),
          catchError(error => {
            console.error('Error in processing:', error);
            this.isLoading = false;
            return of([]); 
          })
        )
        .subscribe({
          next: (detailsArray: any) => {
            if (Array.isArray(detailsArray) && detailsArray.every(detail => 'name' in detail && 'country' in detail && 'source' in detail)) {
              this.placesDetails = detailsArray.map(detail => ({
                name: detail.name,
                country: detail.country,
                source: detail.source 
              }));
              console.log('placesDetails:', this.placesDetails);
            } else {
              console.error('Data format is incorrect', detailsArray);
            }
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error during subscription', error);
            this.isLoading = false;
          },
          complete: () => console.log('Subscription completed')
        });
    this.changeDetector.markForCheck();
  }
  
  addDestination(destination: any): void {
    console.log('Adding destination:', destination); 
    const newDestination: Destination = {
      id: uuidv4(), 
      name: destination.name,
      country: destination.country,
      photo: destination.source, 
      tripCost: undefined
    };
    this.destinationService.addDestination(newDestination);
  }
  
}


