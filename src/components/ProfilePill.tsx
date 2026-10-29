import { User } from 'lucide-react';
import { useSheets } from './sheets';

/**
 * Muestra el perfil activo y abre el selector. Los perfiles se guardan
 * a partir de la Fase 3; mientras tanto indica que todavía no hay ninguno.
 */
export function ProfilePill() {
  const { open } = useSheets();
  return (
    <button
      type="button"
      className="btn profile-pill glass-thin"
      onClick={() => open('selector-perfil')}
      aria-label="Perfil activo: ninguno. Cambiar de perfil"
    >
      <span className="profile-dot" aria-hidden="true">
        <User size={16} />
      </span>
      <span>Sin perfil</span>
    </button>
  );
}
