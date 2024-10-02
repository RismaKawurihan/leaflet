import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map!: L.Map;
  selectedBasemap: string = 'streets'; // Default basemap
  tileLayer!: L.TileLayer; // Menyimpan layer peta

  constructor() { }

  ngOnInit() { }

  ionViewDidEnter() {
    // Inisialisasi peta
    this.map = L.map('mapId').setView([51.505, -0.09], 10);

    // Menambahkan layer peta awal
    this.addTileLayer(this.selectedBasemap);

    // Membuat ikon untuk marker
    const icon = L.icon({
      iconUrl: 'https://img.icons8.com/?size=100&id=19608&format=png&color=000000',
      iconSize: [38, 50],    // Ukuran ikon (sesuaikan ini dengan ukuran asli ikon)
      iconAnchor: [19, 47],  // Titik anchor (setengah dari lebar dan tinggi ikon)
      popupAnchor: [0, -47], // Lokasi popup relatif terhadap ikon
    });

    // Menambahkan marker ke peta
    L.marker([51.5, -0.09], { icon }).addTo(this.map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();
  }

  // Menambahkan layer peta
  addTileLayer(basemap: string) {
    // Hapus layer peta sebelumnya jika ada
    if (this.tileLayer) {
      this.tileLayer.remove();
    }

    // Pilih URL berdasarkan basemap yang dipilih
    let tileUrl: string;
    switch (basemap) {
      case 'streets':
        tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'; // OpenStreetMap jalanan
        break;
      case 'topo':
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'; // OpenTopoMap
        break;
      case 'satellite':
        tileUrl = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'; // Peta satelit dari ArcGIS
        break;
      case 'topo-vector':
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'; // OpenTopoMap sebagai vektor
        break;
      case 'carto-positron':
        tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'; // Peta minimalis dari CartoDB (Positron)
        break;
      default:
        tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'; // Default ke OpenStreetMap
        break;
    }


    // Tambahkan layer peta baru
    this.tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  // Mengubah basemap
  changeBasemap() {
    this.addTileLayer(this.selectedBasemap);
  }
}
