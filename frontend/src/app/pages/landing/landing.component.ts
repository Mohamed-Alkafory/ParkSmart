import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Public landing page: its content is static, so no service calls are needed.
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
})
export class LandingComponent {}
