import Database from 'better-sqlite3'

const db = new Database(process.env.DB_PATH || './trustflow.db')

db.pragma('journal_mode = WAL')

db.exec(`
  create table if not exists clients (
    id text primary key,
    name text not null,
    status text not null default 'pending',
    created_at text not null default (datetime('now'))
  );

  create table if not exists documents (
    id text primary key,
    client_id text not null,
    file_url text not null,
    type text not null,
    extracted_data text,
    created_at text not null default (datetime('now')),
    foreign key (client_id) references clients(id)
  );

  create table if not exists invoices (
    id text primary key,
    client_id text not null,
    amount real not null,
    status text not null default 'outstanding',
    due_date text,
    created_at text not null default (datetime('now')),
    foreign key (client_id) references clients(id)
  );

  create table if not exists payments (
    id text primary key,
    client_id text not null,
    invoice_id text not null,
    amount real not null,
    source text not null,
    status text not null,
    summary text,
    created_at text not null default (datetime('now')),
    foreign key (client_id) references clients(id),
    foreign key (invoice_id) references invoices(id)
  );

  create table if not exists escalations (
    id text primary key,
    client_id text not null,
    reason text not null,
    agent_context text,
    status text not null default 'pending',
    reviewer_decision text,
    created_at text not null default (datetime('now')),
    foreign key (client_id) references clients(id)
  );
`)

export default db
