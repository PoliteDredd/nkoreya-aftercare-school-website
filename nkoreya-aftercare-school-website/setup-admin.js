// Quick setup script to create an admin user
// Run this with: node setup-admin.js

import { createClient } from '@supabase/supabase-js';

// You'll need to get these from your Supabase project settings
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Use service role key, not anon key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const email = 'admin@school.com'; // Change this to your desired admin email
  const password = 'admin123456'; // Change this to your desired password
  
  try {
    // 1. Create the user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // Skip email confirmation
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return;
    }

    console.log('User created:', authData.user.id);

    // 2. Add admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Error adding admin role:', roleError);
      return;
    }

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('You can now log in to the admin portal');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

createAdminUser();