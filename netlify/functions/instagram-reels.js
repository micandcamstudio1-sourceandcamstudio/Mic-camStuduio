
exports.handler = async function () {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Instagram configuration is missing" })
    };
  }

  try {
    const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=30&access_token=${accessToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Instagram API request failed", details: data })
      };
    }

    const reels = (data.data || []).filter(
      item => item.media_type === "VIDEO"
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900"
      },
      body: JSON.stringify({ reels })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unable to load Instagram reels" })
    };
  }
};

