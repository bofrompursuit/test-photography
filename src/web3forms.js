// Web3Forms emails every submission to the inbox this access key was created
// for (bo.moldenhauer@pursuit.org). The key is meant to live in public client
// code: it can only ever send to that one address. Shared by the Starter
// Project intake and the Contact card.
export const WEB3FORMS_ACCESS_KEY = "25f5b66b-1733-41ff-821d-db2f7c83d9de";
const ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Posts one submission. `fields` are printed in the email as "key: value"
 * lines, in insertion order. Resolves on success, throws with the service's
 * message otherwise.
 */
export async function sendToInbox({ subject, fromName, replyTo, botcheck = false, fields }) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject,
      from_name: fromName,
      // Replying to the notification email goes straight to the visitor.
      ...(replyTo ? { replyto: replyTo } : {}),
      botcheck,
      ...fields,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.message || response.statusText);
  return result;
}
