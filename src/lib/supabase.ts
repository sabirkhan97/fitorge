import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tdungunwiizbnvonlaxy.supabase.co"
const supabaseAnonKey = "sb_publishable_1-DYsgj8wV0jrj9DC6entQ_swpYjPg9" 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)