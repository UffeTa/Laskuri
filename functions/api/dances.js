import { DANCE_STYLES } from '../../public/dances/registry.js';
import { json } from '../lib/http.js';

export function onRequestGet() {
  return json({
    ok: true,
    dances: DANCE_STYLES.map(({ id, name, description }) => ({ id, name, description })),
  });
}
