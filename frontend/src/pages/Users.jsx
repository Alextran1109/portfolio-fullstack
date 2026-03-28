import EntityCrud from '../components/EntityCrud';

const fields = [
  { name: 'firstname', label: 'First name', required: true },
  { name: 'lastname', label: 'Last name', required: true },
  { name: 'email', label: 'Email', required: true },
  { name: 'username', label: 'Username' },
  { name: 'password', label: 'Password', type: 'password', required: true, onlyCreate: true },
];

const emptyForm = {
  firstname: '',
  lastname: '',
  email: '',
  username: '',
  password: '',
};

export default function Users() {
  return (
    <EntityCrud
      title="Users"
      resource="users"
      fields={fields}
      emptyForm={emptyForm}
      titleLine={(u) => `${u.firstname} ${u.lastname}`}
      subLine={(u) => (
        <>
          {u.email}
          {u.username ? ` · ${u.username}` : ''}
        </>
      )}
    />
  );
}
