import { environment } from '../environments/environment';
import { MEDIA_URI, MEDIA_SM } from '../shared-ng/config';

export function resolveMaskImage(photo_URI: string, media_link: string = MEDIA_URI) {
  if (photo_URI && photo_URI !== 'None') {
    return (media_link + '/' + photo_URI);
  } else {
    return '';
  }
}
