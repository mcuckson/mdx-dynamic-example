// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  try {
    if (typeof req.query.path !== "string") {
      res.status(400).send();
      return;
    }
    const data = await backend.getExternalData(
      req.params.repo,
      req.params.owner,
      req.query.path
    );
    res.send(data);
  } catch (err) {
    res.status(404).send();
  }
}
