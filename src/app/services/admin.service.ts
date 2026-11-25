import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FilmManuelData {
  titre: string;
  synopsis?: string;
  note?: string;
  duree?: string;
  dateSortie?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8081/api/admin';

  constructor(private http: HttpClient) {}

  // =========================
  // DASHBOARD
  // =========================
  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // =========================
  // USERS
  // =========================
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/search?query=${encodeURIComponent(query)}`);
  }

  toggleUserStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/toggle`, {}, { responseType: 'text' });
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data, { responseType: 'text' });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' });
  }

  // =========================
  // STATISTIQUES
  // =========================
  getGenresPopulaires(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/genres`);
  }

  getInscriptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/inscriptions`);
  }

  getTopFilmsVues(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/films/top-vues`);
  }

  getTopFilmsFavoris(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/films/top-favoris`);
  }

  // =========================
  // SURVEILLANCE
  // =========================
  getLastConnexions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/connexions`);
  }

  getActiviteRecente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activite`);
  }

  getTmdbStatus(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/tmdb/status`);
  }

  // =========================
  // FILMS PLATEFORME — CRUD COMPLET
  // =========================

  getFilmsPlateforme(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/films/plateforme`);
  }

  getFilmDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/films/plateforme/${id}`);
  }

  ajouterFilmManuel(data: FilmManuelData, file: File): Observable<any> {
    const formData = this.buildFormData(data);
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/films/manuel`, formData);
  }

  modifierFilmManuel(id: number, data: FilmManuelData, file: File | null): Observable<any> {
    const formData = this.buildFormData(data);
    if (file) {
      formData.append('file', file);
    }
    return this.http.put(`${this.apiUrl}/films/manuel/${id}`, formData);
  }

  supprimerFilm(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/films/plateforme/${id}`, { responseType: 'text' });
  }

  private buildFormData(data: FilmManuelData): FormData {
    const formData = new FormData();
    formData.append('titre', data.titre);
    if (data.synopsis) formData.append('synopsis', data.synopsis);
    if (data.note) formData.append('note', data.note);
    if (data.duree) formData.append('duree', data.duree);
    if (data.dateSortie) formData.append('dateSortie', data.dateSortie);
    if (data.posterUrl) formData.append('posterUrl', data.posterUrl);
    if (data.backdropUrl) formData.append('backdropUrl', data.backdropUrl);
    if (data.genres) formData.append('genres', data.genres);
    return formData;
  }

  // =========================
  // STREAM
  // =========================
  getStreamUrl(filmId: number): string {
    return `http://localhost:8081/api/films/${filmId}/stream`;
  }
}
