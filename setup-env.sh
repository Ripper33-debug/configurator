#!/bin/bash

# Create .env.local file with Supabase configuration
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://elylrbrnwwtvxkjuzoaw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVseWxyYnJud3d0dnhranV6b2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDc2MzcsImV4cCI6MjA3MjY4MzYzN30.-VROhAloCfVTRiOnUmj6bduT0w0MC79uECf0oE6zihI

# Enable Supabase integration
NEXT_PUBLIC_USE_SUPABASE=true
EOF

echo "✅ Environment variables created in .env.local"
echo "🔧 Supabase URL: https://elylrbrnwwtvxkjuzoaw.supabase.co"
echo "🔑 Anon Key: Set"
echo ""
echo "Next steps:"
echo "1. Create 'models' bucket in Supabase Storage"
echo "2. Upload your GLB files to the bucket"
echo "3. Run 'npm run dev' to test"
