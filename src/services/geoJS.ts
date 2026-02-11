import { eventBus } from "./EventBus";
import { GeoJSLocation } from "../types/geoJS";

export const eventNameCall = "geo:requestCurrentLocation";
export const eventNameResult = "geo:loaded";
export const eventNameError = "geo:error";

function requestCurrentLocationData(): void {
  fetch("https://get.geojs.io/v1/ip/geo.json")
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json(); // as Promise<GeoLocation>;
    })
    .then((result: GeoJSLocation) => eventBus.trigger(eventNameResult, result))
    .catch((error: Error) => eventBus.trigger(eventNameError, error.message));
}

/// зарегистрировать вызывающее событие
eventBus.on(eventNameCall, requestCurrentLocationData);
