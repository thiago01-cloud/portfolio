import FormShell from '@/components/admin/FormShell';
import { changePassword } from '../../actions';

export default function AccountPage() {
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Mon compte</h1>
          <p>Changez le mot de passe créé à l&apos;installation.</p>
        </div>
      </header>
      <section className="panel narrow">
        <FormShell action={changePassword} submitLabel="Changer le mot de passe">
          <div className="fields single">
            <div className="field">
              <label htmlFor="current">Mot de passe actuel</label>
              <input id="current" name="current" type="password" autoComplete="current-password" required />
            </div>
            <div className="field">
              <label htmlFor="next">Nouveau mot de passe</label>
              <input id="next" name="next" type="password" autoComplete="new-password" minLength={8} required />
              <small className="help">8 caractères minimum.</small>
            </div>
            <div className="field">
              <label htmlFor="confirm">Confirmer le nouveau mot de passe</label>
              <input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
            </div>
          </div>
        </FormShell>
      </section>
    </>
  );
}
