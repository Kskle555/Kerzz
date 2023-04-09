import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  titles: any[] = [];
  lastDisplayedIndex = 9;
  searchTerm: string = '';
  userLatitude: number = 0;
  userLongitude: number = 0;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
        this.getNearbyFeeds();
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  getNearbyFeeds(): void {
    this.apiService.getFeeds(this.userLatitude, this.userLongitude).subscribe(
      (response: any) => {
        console.log(response.response);
        const sortedFeeds = response.response.sort((a: any, b: any) => {
          const distanceA = this.calculateDistance(this.userLatitude, this.userLongitude, a.location[0], a.location[1]);
          const distanceB = this.calculateDistance(this.userLatitude, this.userLongitude, b.location[0], b.location[1]);
          return distanceA - distanceB;
        });
        this.titles = sortedFeeds.map((item: any) => item.title);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    const element = document.documentElement;
    const offset = element.scrollTop + element.clientHeight;
    const height = element.offsetHeight;

    if (offset === height) {
      this.lastDisplayedIndex += 10;
    }
  }

  getFilteredTitles(): any[] {
    if (this.searchTerm === '') {
      return this.titles.slice(0, this.lastDisplayedIndex);
    } else {
      return this.titles.filter(title => title.toLowerCase().includes(this.searchTerm.toLowerCase())).slice(0, this.lastDisplayedIndex);
    }
  }

  search(): void {
    this.lastDisplayedIndex = 9;
  }
}
