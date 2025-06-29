import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakHelper {
  #keycloak = inject(Keycloak);

  logout() {
    this.#keycloak.logout();
  }
}
