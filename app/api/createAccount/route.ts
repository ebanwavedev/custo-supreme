// app/api/createAccount/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const clientId = process.env.ZOHO_CLIENT_ID!;
const clientSecret = process.env.ZOHO_CLIENT_SECRET!;

export async function POST(request: NextRequest) {
  let bookingDetails;

  // ✅ Safe JSON parsing
  try {
    bookingDetails = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let accessToken: string | null = null;

  // ✅ Safe KV access
  try {
    accessToken = await kv.get('zoho_access_token');
  } catch (e) {
    console.error('KV not configured properly:', e);
  }

  if (!accessToken) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain access token' }, { status: 500 });
    }
  }

  const nameParts = bookingDetails.name?.trim()?.split(' ') || [];

  const leadData = {
    data: [
      {
        Company: bookingDetails.company || 'Unknown',
        First_Name: nameParts[0] || 'Unknown',
        Last_Name: nameParts.slice(1).join(' ') || 'Unknown',
        Email: bookingDetails.email || '',
        Phone: bookingDetails.phone || '',
        Description: bookingDetails.additionalInfo || '',
        Street: bookingDetails.street || '',
        City: bookingDetails.city || '',
        State: bookingDetails.state || '',
        Postal_Code: bookingDetails.zipCode || '',
        Lead_Source: 'Website',
      },
    ],
  };

  let response = await fetch('https://www.zohoapis.com/crm/v3/Leads', {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });

  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 500 });
    }

    response = await fetch('https://www.zohoapis.com/crm/v3/Leads', {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
  }

  const text = await response.text();

  if (!response.ok) {
    console.error('Zoho raw error:', text);
    return NextResponse.json(
      { success: false, zohoError: text },
      { status: response.status }
    );
  }

  return NextResponse.json({ success: true, data: JSON.parse(text) });
}

async function refreshAccessToken(): Promise<string | null> {
  let refreshToken: string | null = null;

  try {
    refreshToken = await kv.get('zoho_refresh_token');
  } catch (e) {
    console.error('KV error (refresh token):', e);
  }

  if (!refreshToken) {
    return null;
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken as string,
  });

  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    body: params,
  });

  const data = await response.json();

  if (data.error) {
    console.error('Error refreshing access token:', data);
    return null;
  }

  try {
    await kv.set('zoho_access_token', data.access_token, { ex: 3600 });
  } catch (e) {
    console.error('KV write error:', e);
  }

  return data.access_token;
}
