import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';  // Import HttpClient

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map!: L.Map;
  selectedBasemap: string = 'streets'; // Default basemap
  tileLayer!: L.TileLayer; // Menyimpan layer peta
  locations: any[] = []; // Array untuk menyimpan data lokasi

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Muat data lokasi dari file JSON
    this.http.get<any[]>('assets/locations.json').subscribe(data => {
      this.locations = data;
      this.loadMap();  // Setelah data dimuat, inisialisasi peta
    });
  }

  ionViewDidEnter() {
    // Peta akan dimuat setelah data lokasi tersedia
    if (this.locations.length > 0) {
      this.loadMap();
    }
  }

  loadMap() {
    // Inisialisasi peta dengan koordinat Yogyakarta
    this.map = L.map('mapId').setView([-7.797068, 110.370529], 13);

    // Menambahkan layer peta awal
    this.addTileLayer(this.selectedBasemap);

    // Menambahkan marker dari data JSON
    this.locations.forEach(location => {
      L.circleMarker([location.Latitude, location.Longitude], {
        radius: 20,  // Ukuran radius lingkaran
        color: 'red',  // Warna tepi lingkaran
        fillColor: 'yellow',  // Warna isi lingkaran
        fillOpacity: 0.5,  // Transparansi isi lingkaran
      })
        .addTo(this.map)
        .bindPopup(`
          <b>Nama Café:</b> ${location.Nama}<br>
          <b>Jenis:</b> ${location.Jenis}<br>
          <b>Rating:</b> ${location.Rating}<br>
          <b>Harga:</b> Rp ${location.Harga.toLocaleString()}<br>
        `)
        .openPopup();
    });
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
