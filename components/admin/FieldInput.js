// Champ de formulaire générique, piloté par la configuration de lib/resources.js
export default function FieldInput({ field, value }) {
  const id = `f-${field.name}`;
  const v = value ?? field.default ?? '';
  const help = field.help ? <small className="help">{field.help}</small> : null;

  if (field.type === 'checkbox') {
    return (
      <div className="field field-check">
        <label htmlFor={id}>
          <input id={id} type="checkbox" name={field.name} defaultChecked={Boolean(value ?? field.default)} />
          {field.label}
        </label>
        {help}
      </div>
    );
  }

  if (field.type === 'multi') {
    const selected = String(v).split(',').filter(Boolean);
    return (
      <fieldset className="field">
        <legend>{field.label}</legend>
        <div className="check-row">
          {field.options.map(([key, label]) => (
            <label key={key}>
              <input type="checkbox" name={field.name} value={key} defaultChecked={selected.includes(key)} />
              {label}
            </label>
          ))}
        </div>
        {help}
      </fieldset>
    );
  }

  let input;
  switch (field.type) {
    case 'textarea':
      input = <textarea id={id} name={field.name} rows={field.rows || 4} defaultValue={v} required={field.required} />;
      break;
    case 'select':
      input = (
        <select id={id} name={field.name} defaultValue={String(v)}>
          {field.options.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      );
      break;
    case 'number':
      input = <input id={id} type="number" name={field.name} defaultValue={v === '' ? 0 : v} />;
      break;
    case 'color':
      input = <input id={id} type="color" name={field.name} defaultValue={v || '#1C5D8A'} />;
      break;
    case 'month':
      input = <input id={id} type="month" name={field.name} defaultValue={v} required={field.required} />;
      break;
    case 'url':
      input = <input id={id} type="url" name={field.name} defaultValue={v} placeholder="https://" />;
      break;
    default:
      input = <input id={id} type="text" name={field.name} defaultValue={v} required={field.required} />;
  }

  return (
    <div className={`field${field.type === 'textarea' ? ' field-wide' : ''}`}>
      <label htmlFor={id}>
        {field.label}
        {field.required ? <span className="req"> (obligatoire)</span> : null}
      </label>
      {input}
      {help}
    </div>
  );
}
