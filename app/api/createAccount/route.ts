// app/api/createAccount/route.ts

import { NextRequest, NextResponse } from 'next/server';

const clientId = process.env.ZOHO_CLIENT_ID!;
const clientSecret = process.env.ZOHO_CLIENT_SECRET!;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN!;

export async function POST(request: NextRequest) {
  let bookingDetails;

  try {
    bookingDetails = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const accessToken = await refreshAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
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
        Zip_Code: bookingDetails.zipCode || '',
        Lead_Source: 'Website',
      },
    ],
  };

  const response = await fetch('https://www.zohoapis.com/crm/v3/Leads', {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });

  const text = await response.text();

  if (!response.ok) {
    console.error('Zoho raw error:', text);
    return NextResponse.json({ success: false, zohoError: text }, { status: response.status });
  }

  return NextResponse.json({ success: true, data: JSON.parse(text) });
}

async function refreshAccessToken(): Promise<string | null> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    body: params,
  });

  const data = await response.json();

  if (data.error) {
    console.error('Error refreshing token:', data);
    return null;
  }

  return data.access_token;
}
