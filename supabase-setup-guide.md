# 🚀 Supabase Setup Guide

## ✅ Environment Variables Set
Your Supabase credentials are now configured in `.env.local`:
- **URL:** https://elylrbrnwwtvxkjuzoaw.supabase.co
- **Anon Key:** Set ✅

## 📋 Next Steps to Complete Setup:

### 1. Create Storage Bucket
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project: `elylrbrnwwtvxkjuzoaw`
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Name it: `models`
6. Make it **Public** (so models can be accessed)
7. Click **"Create bucket"**

### 2. Upload Your Models
1. In the `models` bucket, click **"Upload file"**
2. Upload these files:
   - `trecc.glb` (your main shelter model)
   - `interiors/CommandPosting.glb` (interior model)

### 3. Test the Connection
1. Open your app: http://localhost:3000
2. Open Developer Tools → Console
3. Look for these messages:
   ```
   🔧 Supabase URL: https://elylrbrnwwtvxkjuzoaw.supabase.co
   🔧 Supabase Key: Set
   🔧 Supabase working: true
   🔧 Using Supabase URL: https://...
   ```

## 🎯 Expected Results:
- **Faster model loading** (CDN delivery)
- **Better performance** (no server bandwidth limits)
- **Scalable** (can handle many users)

## 🆘 Troubleshooting:
- If you see "Supabase not configured" → Check environment variables
- If you see "Supabase working: false" → Check bucket exists and is public
- If models don't load → Check file names match exactly

## 📱 For Deployment:
Add these environment variables to your deployment platform:
```
NEXT_PUBLIC_SUPABASE_URL=https://elylrbrnwwtvxkjuzoaw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVseWxyYnJud3d0dnhranV6b2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDc2MzcsImV4cCI6MjA3MjY4MzYzN30.-VROhAloCfVTRiOnUmj6bduT0w0MC79uECf0oE6zihI
```
