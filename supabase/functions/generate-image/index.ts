import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, imageData } = await req.json()
    
    if (!prompt || !imageData) {
      throw new Error('Missing prompt or image data')
    }

    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyAUItcN7ws7MGwWmQQhFcyZsaTnDa5ukgM'
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authorization')
    }

    // Convert base64 image data to proper format
    const base64Data = imageData.split(',')[1] || imageData
    
    // Call Gemini API for image editing
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Transform this image based on the following prompt: "${prompt}". Generate a new image that incorporates the requested changes while maintaining visual quality.`
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    
    // For this demo, since Gemini doesn't directly generate images in this API,
    // we'll simulate the process and return the original image with metadata
    // In a real implementation, you'd use a proper image generation API
    
    const generationId = crypto.randomUUID()
    
    // Store generation record in database
    const { error: dbError } = await supabase
      .from('generations')
      .insert({
        id: generationId,
        user_id: user.id,
        prompt: prompt,
        original_image_url: '', // Will be set when image is uploaded
        generated_image_url: '', // Will be set when result is uploaded
        status: 'completed',
        metadata: {
          model: 'gemini-1.5-flash',
          response: geminiData
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save generation record')
    }

    // For demo purposes, return the original image as the "generated" result
    // In production, this would be the actual AI-generated image
    return new Response(
      JSON.stringify({
        success: true,
        generationId,
        imageUrl: `data:image/jpeg;base64,${base64Data}`,
        prompt,
        metadata: geminiData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})