# Variables de Entorno para Supabase

## Configuración Local (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

## Configuración Vercel
1. Ir a https://vercel.com/dashboard
2. Seleccionar proyecto "darwinportafolio"
3. Settings → Environment Variables
4. Agregar las mismas variables

## Pasos después de configurar:
1. npm run build (para verificar)
2. git add .
3. git commit -m "feat: configurar variables de entorno Supabase"
4. git push origin main
5. Vercel desplegará automáticamente
