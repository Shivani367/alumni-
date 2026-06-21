const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://poaxhsurnoaohtmzdwon.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYXhoc3Vybm9hb2h0bXpkd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0Mzc5MTcsImV4cCI6MjA0NTAxMzkxN30.dLxi8cD1DL-_WudCw4K-D4bvgaOiFLs19I8X82A70d4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Supabase connection...");
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profileError) {
      console.error("Error querying profiles table:", profileError);
    } else {
      console.log("Successfully queried profiles table. Result count:", profileData.length);
    }

    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);

    if (messageError) {
      console.error("Error querying messages table:", messageError);
    } else {
      console.log("Successfully queried messages table. Result count:", messageData.length);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

test();
