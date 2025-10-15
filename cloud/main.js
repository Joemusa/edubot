import axios from "axios";

Parse.Cloud.define("lookupInvoices", async (request) => {
  const { phone, api_key } = request.params || {};
  if (!phone) throw "Phone number required";

  if (!api_key || api_key !== process.env.API_KEY) throw "Unauthorized";

  const {
    ZOHO_CLIENT_ID,
    ZOHO_CLIENT_SECRET,
    ZOHO_REFRESH_TOKEN,
    ZOHO_ORG_ID,
  } = process.env;

  try {
    const tokenResp = await axios.post("https://accounts.zoho.com/oauth/v2/token", null, {
      params: {
        grant_type: "refresh_token",
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        refresh_token: ZOHO_REFRESH_TOKEN
      }
    });

    const accessToken = tokenResp.data.access_token;

    const contactsResp = await axios.get("https://www.zohoapis.com/invoice/v3/contacts", {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      params: { phone_contains: phone, organization_id: ZOHO_ORG_ID }
    });

    const contacts = contactsResp.data.contacts || [];
    if (contacts.length === 0) return { message: "No contact found" };

    const contact = contacts[0];
    const invoicesResp = await axios.get("https://www.zohoapis.com/invoice/v3/invoices", {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      params: { customer_id: contact.contact_id, organization_id: ZOHO_ORG_ID }
    });

    return {
      contact: contact.contact_name,
      invoices: invoicesResp.data.invoices.map(inv => ({
        number: inv.invoice_number,
        total: inv.total,
        url: inv.invoice_url
      }))
    };
  } catch (err) {
    throw `Error: ${err.message}`;
  }
});
