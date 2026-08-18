import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://veyepecpzztfgdjorzof.supabase.co'
const supabaseKey = 'sb_publishable_3YYZGv6UTyITYt4Aun8avg_mPev6Sx6'

export const supabase = createClient(supabaseUrl, supabaseKey)