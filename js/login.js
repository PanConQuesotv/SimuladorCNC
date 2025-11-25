import { createClient } from '@supabase/supabase-js'

// Reemplaza con tus datos de Supabase
const supabaseUrl = 'https://wigcxvqcdmkvvjhunucm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ2N4dnFjZG1rdnZqaHVudWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjA0NzUsImV4cCI6MjA3OTYzNjQ3NX0.leoaPpsLIdTEh9UjxfxuCHB4_PNF-hSVrt-PzSfDxiU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Función de registro
export async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    // Crear usuario en auth
    const { data: user, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (signUpError) {
        message.textContent = signUpError.message;
        return;
    }

    // Crear perfil en tabla profiles con rol estudiante
    const { error: profileError } = await supabase.from('profiles').insert([
        {
            id: user.user.id,
            email: email,
            display_name: name,
            role: 'estudiante'
        }
    ]);

    if (profileError) {
        message.textContent = profileError.message;
        return;
    }

    message.style.color = 'green';
    message.textContent = 'Registro exitoso. Puedes iniciar sesión.';
}

// Función de login
export async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        message.textContent = error.message;
        return;
    }

    // Traer rol del usuario
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
        message.textContent = profileError.message;
        return;
    }

    // Redirigir según rol
    switch(profile.role) {
        case 'admin':
            window.location.href = 'admin.html';
            break;
        case 'docente':
            window.location.href = 'teacher.html';
            break;
        default:
            window.location.href = 'student.html';
            break;
    }
}
