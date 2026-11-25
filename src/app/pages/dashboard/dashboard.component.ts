import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgChartsModule,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboard: any = null;
  loading = true;
  tmdbStatus = false;
  lastConnexions: any[] = [];

  // Chart Genres Doughnut
  genresChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa'
      ],
      borderWidth: 0
    }]
  };
  genresChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, font: { size: 12 } }
      }
    }
  };

  // Chart Inscriptions Bar
  inscriptionsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Inscriptions',
      backgroundColor: 'rgba(229,57,53,0.8)',
      borderRadius: 8,
      borderSkipped: false
    }]
  };
  inscriptionsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { stepSize: 1 }
      },
      x: { grid: { display: false } }
    }
  };

  // Chart Top Films Bar horizontal
  filmsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Favoris',
      backgroundColor: 'rgba(30,136,229,0.8)',
      borderRadius: 6,
      borderSkipped: false
    }]
  };
  filmsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { grid: { display: false } }
    }
  };

  constructor(
    private adminService: AdminService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboard();
    this.loadLastConnexions();
  }

  loadDashboard() {
    this.loading = true;
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.tmdbStatus = data.tmdbOperationnel;
        this.loadGenresChart(data.genresPopulaires);
        this.loadInscriptionsChart(data.inscriptionsParSemaine);
        this.loadFilmsChart(data.top10FilmsAimes);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadLastConnexions() {
    this.adminService.getLastConnexions().subscribe({
      next: (data) => { this.lastConnexions = data; },
      error: () => {}
    });
  }

  loadGenresChart(genres: any) {
    if (!genres) return;
    this.genresChartData = {
      labels: Object.keys(genres),
      datasets: [{
        data: Object.values(genres) as number[],
        backgroundColor: [
          '#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa'
        ],
        borderWidth: 0
      }]
    };
  }

  loadInscriptionsChart(inscriptions: any) {
    if (!inscriptions) return;
    this.inscriptionsChartData = {
      labels: Object.keys(inscriptions),
      datasets: [{
        data: Object.values(inscriptions) as number[],
        label: 'Inscriptions',
        backgroundColor: 'rgba(229,57,53,0.8)',
        borderRadius: 8,
        borderSkipped: false
      }]
    };
  }

  loadFilmsChart(films: any[]) {
    if (!films || films.length === 0) return;
    const top5 = films.slice(0, 5);
    this.filmsChartData = {
      labels: top5.map(f => f.titre?.substring(0, 20) + '...'),
      datasets: [{
        data: top5.map(f => f.nombreFavoris || 0),
        label: 'Favoris',
        backgroundColor: 'rgba(30,136,229,0.8)',
        borderRadius: 6,
        borderSkipped: false
      }]
    };
  }

  get topFilms() {
    return this.dashboard?.top10FilmsAimes?.slice(0, 5) || [];
  }
}
