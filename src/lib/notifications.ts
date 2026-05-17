import { Resend } from 'resend';

export interface NotificationPayload {
  to: string;
  subject: string;
  body: string;
  actionUrl?: string;
}

export interface TeamsPayload {
  title: string;
  text: string;
  actionUrl?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

/**
 * 5.2 Email & Microsoft Teams Integration
 * This service handles sending emails via Resend
 * and triggering adaptive cards to Microsoft Teams via Incoming Webhooks.
 */
export class NotificationService {
  
  static async sendEmail(payload: NotificationPayload) {
    console.log(`[EMAIL DISPATCH] To: ${payload.to} | Subject: ${payload.subject}`);
    
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'PRISM Portal <onboarding@resend.dev>',
          to: payload.to,
          subject: payload.subject,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
              <h2>${payload.subject}</h2>
              <p style="white-space: pre-wrap;">${payload.body}</p>
              ${payload.actionUrl ? `<a href="${payload.actionUrl}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Open in Portal</a>` : ''}
              <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #999;">Automated message from PRISM Performance Portal</p>
            </div>
          `
        });
        console.log(`[EMAIL DISPATCH] Success. Sent via Resend API.`);
      } catch (error) {
        console.error('[EMAIL DISPATCH] Resend API Error:', error);
      }
    } else {
      // For Hackathon Demo without key: Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`[EMAIL DISPATCH] Simulated success (No RESEND_API_KEY provided). Action URL included: ${!!payload.actionUrl}`);
    }
    
    return true;
  }

  static async sendTeamsNotification(webhookUrl: string, payload: TeamsPayload) {
    console.log(`[TEAMS DISPATCH] Sending Adaptive Card: ${payload.title}`);
    
    // For Hackathon Demo: Adaptive Card JSON Structure
    const adaptiveCard = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": "6366f1",
      "summary": payload.title,
      "sections": [{
        "activityTitle": payload.title,
        "activitySubtitle": "PRISM Performance Portal",
        "activityImage": "https://cdn-icons-png.flaticon.com/512/3200/3200058.png",
        "text": payload.text
      }],
      "potentialAction": payload.actionUrl ? [
        {
          "@type": "OpenUri",
          "name": "View Goal Sheet",
          "targets": [{ "os": "default", "uri": payload.actionUrl }]
        }
      ] : []
    };

    // If a real webhook exists, it would be called here.
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adaptiveCard)
        });
        if (response.ok) {
           console.log('[TEAMS DISPATCH] Webhook delivered successfully.');
        } else {
           console.log(`[TEAMS DISPATCH] Webhook failed with status: ${response.status}`);
        }
      } catch (e) {
        console.error('[TEAMS DISPATCH] Error sending to Teams:', e);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[TEAMS DISPATCH] Simulated success (No valid Webhook URL provided).`);
    }
    
    return true;
  }
}
