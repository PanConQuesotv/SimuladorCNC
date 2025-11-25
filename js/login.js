import { createClient } from '@supabase/supabase-js'

// Reemplaza con tus datos de Supabase
const supabaseUrl = 'https://wigcxvqcdmkvvjhunucm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ2N4dnFjZG1rdnZqaHVudWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjA0NzUsImV4cCI6MjA3OTYzNjQ3NX0.leoaPpsLIdTEh9UjxfxuCHB4_PNF-hSVrt-PzSfDxiU';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Registro
export async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    if (!name || !email || !password) {
        message.textContent = 'Completa todos los campos';
        return;
    }

    const { data: user, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
        message.textContent = signUpError.message;
        return;
    }

    const { error: profileError } = await supabase.from('profiles').insert([{
        id: user.user.id,
        display_name: name,
        email,
        role: 'estudiante'
    }]);

    if (profileError) {
        message.textContent = profileError.message;
        return;
    }

    message.style.color = 'green';
    message.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
}

// Login
export async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    if (!email || !password) {
        message.textContent = 'Ingresa correo y contraseña';
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        message.textContent = error.message;
        return;
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
        message.textContent = profileError.message;
        return;
    }

    switch(profile.role) {
        case 'admin': window.location.href = 'admin.html'; break;
        case 'docente': window.location.href = 'teacher.html'; break;
        default: window.location.href = 'student.html'; break;
    }
}