module.exports = async (request, response) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://callautomationstudio.com/sitemap.xml`;

  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  response.status(200).send(robots);
};
