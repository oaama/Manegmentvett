"use server"

import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

// Helper function to safely parse JSON responses
async function safeJsonResponse(response: Response) {
  try {
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch (error) {
    console.error('Failed to parse JSON response:', error)
    return { 
      error: true,
      message: 'Invalid response from server',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

type LoginResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  token?: string
  user?: {
    role: string
    [key: string]: any
  }
}

export async function login(prevState: any, formData: FormData): Promise<LoginResponse> {
  // Basic input validation
  const email = formData.get("email")?.toString().trim()
  const password = formData.get("password")?.toString()
  
  if (!email || !password) {
    return {
      success: false,
      message: 'Email and password are required',
      errors: {
        email: !email ? ['Email is required'] : [],
        password: !password ? ['Password is required'] : []
      }
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!apiUrl) {
    console.error('API URL is not configured')
    return {
      success: false,
      message: 'Server configuration error. Please contact support.'
    }
  }

  try {
    console.log('Attempting login for:', email)
    
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store' // Prevent caching
    })

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response:', { status: response.status, text })
      return {
        success: false,
        message: `Server returned an invalid response (${response.status})`,
        errors: { server: ['Invalid server response format'] }
      }
    }
    
    const data = await safeJsonResponse(response)
    
    // Handle JSON parsing errors
    if (data.error) {
      console.error('Error in API response:', data)
      return {
        success: false,
        message: 'Error processing server response',
        errors: { server: [data.message || 'Invalid response format'] }
      }
    }

    console.log('Login response:', { status: response.status, hasToken: !!data.token })

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Login failed (${response.status})`,
        errors: data.errors || { server: ['Authentication failed'] }
      }
    }

    if (!data.token) {
      console.error('No token in response:', data)
      return {
        success: false,
        message: 'Authentication failed: No token received',
        errors: { server: ['Authentication failed'] }
      }
    }

    // Set the auth cookie using the Response cookies API (Next.js 14+)
    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    console.log('Login successful, ready to redirect to dashboard');
    return { success: true, message: 'Login successful', redirect: '/dashboard' };
    
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return {
      success: false,
      message: `Login failed: ${errorMessage}`,
      errors: { server: [errorMessage] }
    }
  }
}

export async function logout() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  try {
    if (token && apiUrl) {
      console.log('Attempting server-side logout...');
      try {
        // Always use /api/auth/logout endpoint
        const response = await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        if (!response.ok) {
          console.warn('Server logout failed with status:', response.status);
        }
      } catch (error) {
        console.warn('Error during server logout (proceeding anyway):', error);
      }
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always delete the cookie and redirect
    const cookieStore = await cookies();
    cookieStore.set('auth_token', '', { maxAge: 0, path: '/' });
    console.log('Logged out successfully');
    redirect('/login');
  }
}
