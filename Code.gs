// ─────────────────────────────────────────────────────────────
//  Bil Expert Bromma — Booking Email Handler
//  Google Apps Script  (paste this at script.google.com)
//
//  DEPLOY:
//    Extensions → Apps Script → paste this code → Save
//    Deploy → New Deployment → Web App
//      Execute as:   Me (Bilexperts3@gmail.com)
//      Who has access: Anyone
//    → Copy the Web App URL → paste into index.html GAS_URL
// ─────────────────────────────────────────────────────────────

var RECIPIENT = "Bilexperts3@gmail.com";

/* ── Entry point ─────────────────────────────────────────── */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    sendBookingEmail(data);
  } catch (err) {
    Logger.log("Error: " + err.message);
  }

  // Always return 200 so the browser fetch resolves
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── Send email ──────────────────────────────────────────── */
function sendBookingEmail(d) {
  var name      = d.customer_name  || "";
  var email     = d.customer_email || "";
  var phone     = d.customer_phone || "";
  var reg       = d.registration   || "";
  var date      = d.booking_date   || "";
  var time      = d.booking_time   || "";
  var services  = d.services       || "";
  var notes     = d.notes          || "–";

  /* ── Mailto bodies for the action buttons ─────────────── */
  var acceptBody =
    "Hej " + name + ",\n\n" +
    "Tack för din bokning! Vi bekräftar härmed din tid:\n\n" +
    "Datum: "    + date     + "\n" +
    "Tid: "      + time     + "\n" +
    "Tjänster: " + services + "\n" +
    "Registreringsnummer: " + reg + "\n\n" +
    "Vi ses!\n\n" +
    "Med vänliga hälsningar,\n" +
    "Muhammad Rumaan\n" +
    "Bil Expert Bromma\n" +
    "Drottningholmsvägen 300, 167 31 Bromma\n" +
    "+46 79-344 78 33";

  var suggestBody =
    "Hej " + name + ",\n\n" +
    "Tack för din bokning! Tyvärr är din önskade tid inte tillgänglig.\n\n" +
    "Vi kan erbjuda dig följande alternativa tid:\n" +
    "Datum: [ANGE DATUM]\n" +
    "Tid:   [ANGE TID]\n\n" +
    "Vänligen bekräfta om detta passar dig.\n\n" +
    "Med vänliga hälsningar,\n" +
    "Muhammad Rumaan\n" +
    "Bil Expert Bromma\n" +
    "Drottningholmsvägen 300, 167 31 Bromma\n" +
    "+46 79-344 78 33";

  var acceptLink =
    "mailto:" + email +
    "?subject=" + encodeURIComponent("✅ Booking Confirmed – " + date + " at " + time) +
    "&body="    + encodeURIComponent(acceptBody);

  var suggestLink =
    "mailto:" + email +
    "?subject=" + encodeURIComponent("🔄 Alternative Booking Time – Bil Expert Bromma") +
    "&body="    + encodeURIComponent(suggestBody);

  /* ── HTML email body ───────────────────────────────────── */
  var html =
    '<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#f7f9fb;font-family:Arial,sans-serif">' +
    '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">' +

      // Header
      '<div style="background:#191c1e;padding:28px 32px">' +
        '<p style="color:#fff;font-size:18px;font-weight:800;margin:0;letter-spacing:-.02em">BIL EXPERT BROMMA</p>' +
        '<p style="color:#737688;font-size:12px;margin:6px 0 0">New Booking Request</p>' +
      '</div>' +

      // Body
      '<div style="padding:32px">' +
        '<h2 style="color:#191c1e;font-size:20px;font-weight:700;margin:0 0 20px">' + name + ' wants to book</h2>' +
        '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
          '<tr><td style="padding:10px 0;border-bottom:1px solid #eceef0;color:#737688;width:38%">Date</td>'         + '<td style="padding:10px 0;border-bottom:1px solid #eceef0;font-weight:700">' + date     + '</td></tr>' +
          '<tr><td style="padding:10px 0;border-bottom:1px solid #eceef0;color:#737688">Time</td>'                  + '<td style="padding:10px 0;border-bottom:1px solid #eceef0;font-weight:700">' + time     + '</td></tr>' +
          '<tr><td style="padding:10px 0;border-bottom:1px solid #eceef0;color:#737688">Services</td>'              + '<td style="padding:10px 0;border-bottom:1px solid #eceef0;font-weight:700">' + services + '</td></tr>' +
          '<tr><td style="padding:10px 0;border-bottom:1px solid #eceef0;color:#737688">Registration</td>'          + '<td style="padding:10px 0;border-bottom:1px solid #eceef0;font-weight:700">' + reg      + '</td></tr>' +
          '<tr><td style="padding:10px 0;border-bottom:1px solid #eceef0;color:#737688">Phone</td>'                 + '<td style="padding:10px 0;border-bottom:1px solid #eceef0;font-weight:700">' + phone    + '</td></tr>' +
          '<tr><td style="padding:10px 0;border-bottom:1px solid #eceef0;color:#737688">Email</td>'                 + '<td style="padding:10px 0;border-bottom:1px solid #eceef0;font-weight:700">' + email    + '</td></tr>' +
          '<tr><td style="padding:10px 0;color:#737688;vertical-align:top">Notes</td>'                              + '<td style="padding:10px 0">'                                                 + notes    + '</td></tr>' +
        '</table>' +

        // Action buttons
        '<div style="margin-top:28px">' +
          '<a href="' + acceptLink  + '" style="background:#0043c8;color:#fff;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;display:inline-block;margin-right:10px;margin-bottom:10px">&#x2705; Accept Booking</a>' +
          '<a href="' + suggestLink + '" style="background:#f2f4f6;color:#191c1e;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;display:inline-block;margin-bottom:10px">&#x1F504; Suggest New Time</a>' +
        '</div>' +
      '</div>' +

      // Footer
      '<div style="padding:18px 32px;background:#f7f9fb;border-top:1px solid #eceef0;text-align:center">' +
        '<p style="color:#737688;font-size:11px;margin:0">Bil Expert Bromma &middot; Drottningholmsv&auml;gen 300, 167 31 Bromma &middot; +46 79-344 78 33</p>' +
      '</div>' +

    '</div></body></html>';

  MailApp.sendEmail({
    to:       RECIPIENT,
    subject:  "🔧 New Booking – " + name + " – " + date + " at " + time,
    htmlBody: html,
    replyTo:  email
  });
}
