import EntityCrud from '../components/EntityCrud';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
];

const emptyForm = {
  title: '',
  description: '',
};

export default function Services() {
  return (
    <EntityCrud
      title="Services"
      resource="services"
      fields={fields}
      emptyForm={emptyForm}
      titleLine={(s) => s.title}
      subLine={(s) => s.description}
    />
  );
}
