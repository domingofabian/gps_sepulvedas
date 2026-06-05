import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements AfterViewInit {
  private readonly apiUrl = 'https://domingofsepulveda.free.nf/api_localiza/api/locations.php';
  private map: any;
  private bounds: any;

  constructor(private http: HttpClient) {}

  ionViewDidEnter(): void {
    if (this.map && this.bounds) {
      google.maps.event.trigger(this.map, 'resize');
      this.map.fitBounds(this.bounds);
    }
  }

  ngAfterViewInit(): void {
    this.loadGoogleMapsScript()
      .then(() => this.loadMap())
      .catch((error) => console.error('Error cargando Google Maps:', error));
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const win = window as any;
      if (win.google && win.google.maps) {
        resolve();
        return;
      }

      const scriptId = 'google-maps-script';
      if (document.getElementById(scriptId)) {
        const existingScript = document.getElementById(scriptId) as HTMLScriptElement;
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject('Google Maps script falló al cargar'));
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('No se pudo cargar el script de Google Maps');
      document.head.appendChild(script);
    });
  }

  loadMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('No se encontró el contenedor del mapa');
      return;
    }

    this.map = new google.maps.Map(mapContainer, {
      center: { lat: -34.6037, lng: -58.3816 },
      zoom: 12,
    });

    this.http.get<{ locations: Array<{ usuario: string; latitud: number; longitud: number }> }>(this.apiUrl)
      .subscribe({
        next: (response) => this.addMarkers(response.locations),
        error: (error) => console.error('Error obteniendo ubicaciones:', error),
      });
  }

  private addMarkers(locations: Array<{ usuario: string; latitud: number; longitud: number }>): void {
    if (!locations?.length) {
      console.warn('No hay ubicaciones para mostrar');
      return;
    }

    this.bounds = new google.maps.LatLngBounds();
    locations.forEach((location) => {
      const position = { lat: Number(location.latitud), lng: Number(location.longitud) };
      const markerIcon = {
        url: '/assets/icon/aca.png',
        scaledSize: new google.maps.Size(40, 40),
      };

      const miMarker = new google.maps.Marker({
        map: this.map,
        position,
        title: location.usuario,
        icon: markerIcon,
        label: {
          text: location.usuario?.charAt(0).toUpperCase() ?? '',
          color: 'white',
          fontWeight: 'bold',
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${location.usuario}</strong><br>Lat: ${position.lat}<br>Lng: ${position.lng}</div>`,
      });

      miMarker.addListener('click', () => infoWindow.open(this.map, miMarker));
      this.bounds.extend(position);
    });

    this.map.fitBounds(this.bounds);
  }
}
