import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HousingService, Housing } from '../../../services/housing.service';
import { AddHouseDialogComponent } from './add-house-dialog/add-house-dialog.component';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-housing-summary',
  templateUrl: './housing-summary.component.html',
  styleUrls: ['./housing-summary.component.css'],
})
export class HousingSummaryComponent implements OnInit {
  @Output() houseSelected = new EventEmitter<Housing>();

  houses$: Observable<Housing[]>;
  filteredHouses$: Observable<Housing[]>;
  loading = false;
  error = '';
  searchTerm = '';

  // Search functionality
  private searchSubject = new BehaviorSubject<string>('');

  // Summary statistics
  totalHouses = 0;
  totalEmployees = 0;
  totalCapacity = 0;
  occupancyRate = 0;

  constructor(
    private housingService: HousingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.houses$ = this.housingService.houses$;

    // Search functionality
    this.filteredHouses$ = combineLatest([
      this.houses$,
      this.searchSubject.asObservable(),
    ]).pipe(
      map(([houses, searchTerm]) => {
        if (!searchTerm.trim()) {
          return houses;
        }

        const term = searchTerm.toLowerCase();
        return houses.filter(
          (house) =>
            house.address.toLowerCase().includes(term) ||
            house.landlord.fullName.toLowerCase().includes(term) ||
            house.landlord.email.toLowerCase().includes(term)
        );
      })
    );
  }

  ngOnInit(): void {
    this.loadHouses();

    // Subscribe to houses changes to update statistics
    this.houses$.subscribe((houses) => {
      this.updateStatistics(houses);
    });
  }

  loadHouses(): void {
    this.loading = true;
    this.error = '';

    this.housingService.getHouses().subscribe({
      next: (houses) => {
        this.loading = false;
        this.snackBar.open(`Loaded ${houses.length} houses`, 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load houses. Please try again.';
        console.error('Error loading houses:', error);
        this.snackBar.open('Failed to load houses', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  updateStatistics(houses: Housing[]): void {
    this.totalHouses = houses.length;
    this.totalEmployees = houses.reduce(
      (sum, house) => sum + house.employees.length,
      0
    );
    this.totalCapacity = houses.reduce(
      (sum, house) => sum + house.facility.beds,
      0
    );
    this.occupancyRate =
      this.totalCapacity > 0
        ? (this.totalEmployees / this.totalCapacity) * 100
        : 0;
  }

  onHouseClick(house: Housing): void {
    this.houseSelected.emit(house);
  }

  onAddHouse(): void {
    const dialogRef = this.dialog.open(AddHouseDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadHouses();
        console.log('New house added:', result);
      }
    });
  }

  // Search functionality
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onSearchInput(): void {
    // Real-time search as user types
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  // Delete house functionality
  onDeleteHouse(house: Housing, event: Event): void {
    event.stopPropagation(); // Prevent card click

    if (house.employees.length > 0) {
      this.snackBar.open(
        'Cannot delete house with residents. Please reassign employees first.',
        'Close',
        {
          duration: 5000,
        }
      );
      return;
    }

    if (
      confirm(`Are you sure you want to delete the house at ${house.address}?`)
    ) {
      this.housingService.deleteHouse(house._id!).subscribe({
        next: () => {
          this.snackBar.open('House deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadHouses();
        },
        error: (error) => {
          console.error('Error deleting house:', error);
          this.snackBar.open('Failed to delete house', 'Close', {
            duration: 5000,
          });
        },
      });
    }
  }

  getOccupancyColor(house: Housing): string {
    const occupancy =
      house.facility.beds > 0
        ? (house.employees.length / house.facility.beds) * 100
        : 0;

    if (occupancy >= 90) return 'warn';
    if (occupancy >= 70) return 'accent';
    return 'primary';
  }

  getOccupancyText(house: Housing): string {
    return `${house.employees.length}/${house.facility.beds} beds`;
  }

  refreshHouses(): void {
    this.loadHouses();
  }

  trackByHouseId(index: number, house: Housing): string {
    return house._id || index.toString();
  }
}
