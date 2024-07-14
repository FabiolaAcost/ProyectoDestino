import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { Destination } from '../../models/destination';
import { DestinationsService } from '../../services/destinations.service';
import { IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonButtons, IonIcon, IonModal, IonTitle, IonHeader, IonToolbar, IonContent, IonInput, IonImg } from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {trashOutline, cameraOutline, airplaneOutline} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-destination-list',
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.scss'],
  standalone: true,
  imports: [IonImg,IonImg, IonHeader, IonTitle, IonModal, FormsModule,CommonModule, IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonButtons, IonIcon,IonToolbar,IonContent,IonInput]
})
export class DestinationListComponent implements OnInit{

  @Input() destinations: Destination[] = [];
  @Output() destinationDeleted = new EventEmitter<Destination>();
  isModalOpen = false;
  selectedDestination?: Destination;
  newTripCost?: number;
  isDeleteModalOpen = false;

  constructor (private destinationsService: DestinationsService,private changeDetector: ChangeDetectorRef){
    addIcons({ trashOutline, cameraOutline,airplaneOutline});
    console.log('DestinationListComponent constructor executed');
  }

  ngOnInit() {
    this.destinations = this.destinationsService.getDestinations();
  }

  deleteDestination(destination: Destination) {
    this.destinationsService.removeDestination(destination.id);
    this.destinations = this.destinationsService.getDestinations();
    this.changeDetector.detectChanges(); 
  }

  openRegisterValueModal(destination: Destination) {
    this.selectedDestination = destination;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onWillDismiss(event: any) {
    if (event.role === 'save') {
      this.saveNewCost();
    }
  }
  onWillDismissDelete(event:any){

  }

  async capturePhoto(destination: Destination) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      if (image.base64String) {
        destination.photo = `data:image/jpeg;base64,${image.base64String}`;
        this.changeDetector.detectChanges();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }

  saveNewCost() {
    if (this.selectedDestination && this.newTripCost) {
      this.destinationsService.updateTripCost(this.selectedDestination.id, this.newTripCost);
      this.newTripCost = undefined; // Reset the input
      this.closeModal();
    }
  }

  openDeleteConfirmModal(destination: Destination) {
    this.selectedDestination = destination;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    if (this.selectedDestination) {
      this.destinationsService.removeDestination(this.selectedDestination.id);
      this.destinations = this.destinationsService.getDestinations(); 
      this.changeDetector.detectChanges();  
      this.closeDeleteModal(); 
    }
  }
}