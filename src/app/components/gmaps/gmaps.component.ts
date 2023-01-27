import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/model/interfaces/order';

declare var google: any;

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.component.html',
  styleUrls: ['./gmaps.component.scss'],
  providers: [MessageService],
})
export class GmapsComponent {
  @Input() order: Order;

  directionsService: any = new google.maps.DirectionsService();
  directionsRenderer: any = new google.maps.DirectionsRenderer();
  options = {
    center: { lat:  53.2194, lng: 6.5665 },
    zoom: 12,
  };

  overlays: any[];

  dialogVisible: boolean;

  markerTitle: string | null;

  selectedPosition: any;

  infoWindow = new google.maps.InfoWindow();

  map: any;

  draggable: boolean;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    /*  this.initOverlays(); */
    this.calcRoute();
  }

  calcRoute = () => {
    if (!this.order.id) {
      return;
    }
    const sInfo = this.order.sender_info;
    const rInfo = this.order.receiver_info;
    const origin = `
      ${sInfo.street_and_number},
      ${sInfo.zipcode},
      ${sInfo.city},
      ${sInfo.country}
    `;
    const destination = `
      ${rInfo.street_and_number},
      ${rInfo.zipcode},
      ${rInfo.city},
      ${rInfo.country}
    `;

    this.directionsService
      .route({
        origin,
        destination,
        travelMode: 'DRIVING',
      })
      .then((res: any) => {
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(res);
      });
  };

  handleMapClick(event: any) {
    this.dialogVisible = true;
    this.selectedPosition = event.latLng;
  }

  handleOverlayClick(event: any) {
    let isMarker = event.overlay.getTitle != undefined;

    if (isMarker) {
      let title = event.overlay.getTitle();
      this.infoWindow.setContent('' + title + '');
      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());

      this.messageService.add({
        severity: 'info',
        summary: 'Marker Selected',
        detail: title,
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Shape Selected',
        detail: '',
      });
    }
  }

  addMarker() {
    this.overlays.push(
      new google.maps.Marker({
        position: {
          lat: this.selectedPosition.lat(),
          lng: this.selectedPosition.lng(),
        },
        title: this.markerTitle,
        draggable: this.draggable,
      })
    );
    this.markerTitle = null;
    this.dialogVisible = false;
  }

  handleDragEnd(event: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Marker Dragged',
      detail: event.overlay.getTitle(),
    });
  }

  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = [
        new google.maps.Marker({
          position: { lat: 36.879466, lng: 30.667648 },
          title: 'Konyaalti',
        }),
        new google.maps.Marker({
          position: { lat: 36.883707, lng: 30.689216 },
          title: 'Ataturk Park',
        }),
        new google.maps.Marker({
          position: { lat: 36.885233, lng: 30.702323 },
          title: 'Oldtown',
        }),
        new google.maps.Polygon({
          paths: [
            { lat: 36.9177, lng: 30.7854 },
            { lat: 36.8851, lng: 30.7802 },
            { lat: 36.8829, lng: 30.8111 },
            { lat: 36.9177, lng: 30.8159 },
          ],
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: '#1976D2',
          fillOpacity: 0.35,
        }),
        new google.maps.Circle({
          center: { lat: 36.90707, lng: 30.56533 },
          fillColor: '#1976D2',
          fillOpacity: 0.35,
          strokeWeight: 1,
          radius: 1500,
        }),
        new google.maps.Polyline({
          path: [
            { lat: 36.86149, lng: 30.63743 },
            { lat: 36.86341, lng: 30.72463 },
          ],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0.5,
          strokeWeight: 2,
        }),
      ];
    }
  }

  zoomIn(map: any) {
    map.setZoom(map.getZoom() + 1);
  }

  zoomOut(map: any) {
    map.setZoom(map.getZoom() - 1);
  }

  clear() {
    this.overlays = [];
  }
}
