// app/api/createAccount/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const clientId = process.env.ZOHO_CLIENT_ID!;
const clientSecret = process.env.ZOHO_CLIENT_SECRET!;

export async function POST(request: NextRequest) {
  const bookingDetails = await request.json();

  let accessToken = await kv.get('zoho_access_token');

  if (!accessToken) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain access token' }, { status: 500 });
    }
  }

  const leadData = {
    data: [
      {
        Company: bookingDetails.company,
        First_Name: bookingDetails.name.split(' ')[0] || 'Unknown',
        Last_Name: bookingDetails.name.split(' ')[1] || 'Unknown',
        Email: bookingDetails.email,
        Phone: bookingDetails.phone,
        Description: bookingDetails.additionalInfo || '',
        Street: bookingDetails.street || '',
        City: bookingDetails.city || '',
        State: bookingDetails.state || '',
        Zip_Code: bookingDetails.zipCode || '',
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
    // Access token may have expired; refresh it
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 500 });
    }

    // Retry the request with the new access token
    response = await fetch('https://www.zohoapis.com/crm/v3/Leads', {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
  }

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error creating lead:', errorData);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead in Zoho CRM.' },
      { status: response.status }
    );
  }

  const responseData = await response.json();
  return NextResponse.json({ success: true, data: responseData });
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await kv.get('zoho_refresh_token');

  if (!refreshToken) {
    console.error('Refresh token not available');
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

  // Update the access token in Vercel KV
  await kv.set('zoho_access_token', data.access_token, { ex: 3600 }); // Set expiration to 1 hour

  return data.access_token;
}
