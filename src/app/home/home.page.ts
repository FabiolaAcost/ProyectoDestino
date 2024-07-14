import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { DestinationsService } from '../services/destinations.service';
import { Destination } from '../models/destination';
import { DestinationListComponent } from '../components/destination-list/destination-list.component';
import { SearchBarComponent } from "../components/search-bar/search-bar.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, DestinationListComponent, SearchBarComponent],
})
export class HomePage implements OnInit,AfterViewInit {
  destinations: Destination[] = [];

  constructor(private destinationsService: DestinationsService) {
    console.log('HomePage constructor executed');
  }

  ngOnInit() {
    this.loadDestinations();
    console.log('HomePage OnInit executed');
  }
  ngAfterViewInit() {
    console.log('HomePage: ngAfterViewInit executed');
  }

  loadDestinations() {
    this.destinations = this.destinationsService.getDestinations();
    console.log('Destinations loaded in HomePage:', this.destinations)
  }
}
