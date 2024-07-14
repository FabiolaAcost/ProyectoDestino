import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import {PlaceDetails } from '../models/ITravel';
import { Geoname } from './geoname';

@Injectable({
  providedIn: 'root'
})
export class OpenTripMapService {


  private baseUrl = 'https://api.opentripmap.com/0.1';
  private apiKey = '5ae2e3f221c38a28845f05b6e0159047f74ea13ba9edfb741cbc7e36';

  constructor() {}
  getGeoname(name: string, lang: string = 'en'): Observable<Geoname> {
    const url = `${this.baseUrl}/${lang}/places/geoname?name=${encodeURIComponent(name)}&apikey=${this.apiKey}`;
    return from(Http.request({ method: 'GET', url })).pipe(
      map(response => {
        if (response.status === 200) {
          return response.data as Geoname;
        } else {
          throw new Error(`Failed to fetch geoname data: ${response.status}`);
        }
      }),
      catchError(error => throwError('Error fetching geoname: ' + error))
    );
  }

  // Obtiene sugerencias basadas en la ubicación obtenida del geoname
  getAutosuggest(name: string, lat: number, lon: number, lang: string = 'en', radius: number = 5000): Observable<any> {
    const url = `${this.baseUrl}/${lang}/places/autosuggest?name=${encodeURIComponent(name)}&lat=${lat}&lon=${lon}&radius=${radius}&apikey=${this.apiKey}`;
    return from(Http.request({ method: 'GET', url })).pipe(
      map(response => {
        if (response.status === 200 && response.data && response.data.features) {
          return response.data.features.map((feature: any) => ({
            xid: feature.properties.xid,
            name: feature.properties.name,
            dist: feature.properties.dist,
            kinds: feature.properties.kinds
          }));
        } else {
          throw new Error(`Failed to fetch autosuggest data: ${response.status}`);
        }
      }),
      catchError(error => throwError('Error fetching autosuggest: ' + error))
    );
  }

  
  // Obtiene detalles del lugar utilizando el xid
  getPlaceDetails(xid: string, lang: string = 'en'): Observable<PlaceDetails> {
    const url = `${this.baseUrl}/${lang}/places/xid/${xid}?apikey=${this.apiKey}`;
    return from(Http.request({ method: 'GET', url })).pipe(
      map(response => {
        if (response.status === 200) {
          return {
            name: response.data.name,
            country: response.data.address?.country,
            source: response.data.preview?.source
          } as PlaceDetails;
        } else {
          throw new Error(`Failed to fetch place details: ${response.status}`);
        }
      }),
      catchError(error => throwError(() => new Error('Error fetching place details: ' + error)))
    );
  }

}