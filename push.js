const fetch = require('node-fetch');
const moment = require('moment-timezone');

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_API_KEY;

async function sendNotification() {
  try {
    const res = await fetch('https://gospelbites.org/wp-json/wp/v2/posts?per_page=1');
    const [post] = await res.json();

    const title = post.title.rendered;
    const excerptRaw = post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "");
    const excerpt = excerptRaw.split(" ").slice(0, 25).join(" ") + "...";
    const image = post.better_featured_image?.source_url || 'https://gospelbites.org/default.jpg';

const payload = {
  app_id: APP_ID,
  included_segments: ["All"],
  headings: { en: title },
  contents: { en: excerpt },
  chrome_web_image: image,
  send_after: moment().add(1, 'minute').toISOString()  // 🔥 Immediate push
};


    const resp = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    console.log("Notification scheduled:", data);
  } catch (error) {
    console.error("Push failed:", error);
  }
}

sendNotification();
