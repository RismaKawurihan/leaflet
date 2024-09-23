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

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    // Inisialisasi peta
    this.map = L.map('mapId').setView([51.505, -0.09], 10);

    // Menambahkan layer peta awal
    this.addTileLayer(this.selectedBasemap);

    // Membuat ikon untuk marker
    const icon = L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', // Ganti dengan URL ikon yang diinginkan
      iconSize: [38, 95], // Ukuran ikon
      iconAnchor: [22, 94], // Titik anchor dari ikon
      popupAnchor: [-3, -76] // Titik anchor dari popup
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
        tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        break;
      case 'topo':
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        break;
      case 'satellite':
        tileUrl = 'https://{s}.satellite.tiles.mapbox.com/{z}/{x}/{y}.jpg';
        break;
      case 'topo-vector':
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'; // Contoh lain
        break;
      case 'gray-vector':
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; // Contoh lain
        break;
      default:
        tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
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
