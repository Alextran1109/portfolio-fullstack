import EntityCrud from '../components/EntityCrud';

const fields = [
  { name: 'title', label: 'Title', required: true, dataCy: 'project-title' },
  { name: 'completion', label: 'Completion', type: 'date', required: true, dataCy: 'project-completion' },
  { name: 'description', label: 'Description', type: 'textarea', dataCy: 'project-description' },
];

const emptyForm = {
  title: '',
  completion: '',
  description: '',
};

export default function Dashboard() {
  return (
    <div data-cy="dashboard">
      <h1>Dashboard</h1>
      <p className="muted">Manage your projects (add, edit, delete).</p>
      <EntityCrud
        title="Projects"
        resource="projects"
        fields={fields}
        emptyForm={emptyForm}
        titleLine={(p) => p.title}
        subLine={(p) => (p.completion ? String(p.completion).slice(0, 10) : '')}
      />
    </div>
  );
}
