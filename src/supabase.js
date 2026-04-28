// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://staywofehwxmvxpixwrw.supabase.co' // Ejemplo: https://xyz.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YXl3b2ZlaHd4bXZ4cGl4d3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjgxNTgsImV4cCI6MjA5MDgwNDE1OH0.xEHhjcMlVWdPp0HgoA0RjfkSHXWGd95razD58mOcoOQ'   // Es una cadena larguísima

export const supabase = createClient(supabaseUrl, supabaseAnonKey)