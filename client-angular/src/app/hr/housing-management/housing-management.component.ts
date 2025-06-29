import { Component, OnInit } from '@angular/core';
import { Housing } from '../../services/housing.service';

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.css'],
})
export class HousingManagementComponent implements OnInit {
  selectedHouse: Housing | null = null;
  viewMode: 'summary' | 'details' = 'summary';

  constructor() {}

  ngOnInit(): void {
    // Component initialization
  }

  onHouseSelected(house: Housing): void {
    this.selectedHouse = house;
    this.viewMode = 'details';
  }

  onBackToSummary(): void {
    this.selectedHouse = null;
    this.viewMode = 'summary';
  }
}
