import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// TODO (team): public landing page. Links to /login, /register, /parkings. No service calls.
@Component({ selector: 'app-landing', standalone: true, imports: [RouterLink], templateUrl: './landing.component.html' })
export class LandingComponent {}
