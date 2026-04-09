import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fpuwuweqjcqycifjifsx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdXd1d2VxamNxeWNpZmppZnN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYxMzMxMCwiZXhwIjoyMDkwMTg5MzEwfQ.MEG-Es7bZK6pY5PQrgT5UxEMVI93ELSAElNGLGbreE0'
);

async function test() {
  const { data, error } = await supabase
    .schema('voluntariado')
    .from('postulaciones')
    .select(`
      idpostulaciones,
      fechapostulacion,
      estadopostulacion,
      comentario,
      actividades(*),
      voluntarios(*)
    `)
    .limit(1);

  if (error) {
    console.error('Error with actividades:', error.message);
  } else {
    console.log('Success!', data);
  }
}

test();
