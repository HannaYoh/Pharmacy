import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {}
