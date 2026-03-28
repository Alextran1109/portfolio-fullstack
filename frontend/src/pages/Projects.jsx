import EntityCrud from '../components/EntityCrud';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'completion', label: 'Completion', type: 'date', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
];

const emptyForm = {
  title: '',
  completion: '',
  description: '',
};

export default function Projects() {
  return (
    <EntityCrud
      title="Projects"
      resource="projects"
      fields={fields}
      emptyForm={emptyForm}
      titleLine={(p) => p.title}
      subLine={(p) => (p.completion ? String(p.completion).slice(0, 10) : '')}
    />
  );
}
