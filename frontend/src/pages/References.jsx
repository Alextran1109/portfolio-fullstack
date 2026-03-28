import EntityCrud from '../components/EntityCrud';

const fields = [
  { name: 'firstname', label: 'First name', required: true },
  { name: 'lastname', label: 'Last name', required: true },
  { name: 'email', label: 'Email', required: true },
  { name: 'position', label: 'Position' },
  { name: 'company', label: 'Company' },
];

const emptyForm = {
  firstname: '',
  lastname: '',
  email: '',
  position: '',
  company: '',
};

export default function References() {
  return (
    <EntityCrud
      title="References"
      resource="references"
      fields={fields}
      emptyForm={emptyForm}
      titleLine={(r) => `${r.firstname} ${r.lastname}`}
      subLine={(r) => `${r.email}${r.company ? ` · ${r.company}` : ''}`}
    />
  );
}
