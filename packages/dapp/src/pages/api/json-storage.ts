import { NextApiRequest, NextApiResponse } from "next";
import { Blob, File, Web3Storage } from "web3.storage";

function getWeb3Token() {
  const token = process.env.WEB3STORAGE_TOKEN;
  if (!token) throw new Error(`Misconfigured: web3.storage token`);
  return token;
}

const web3Storage = new Web3Storage({ token: getWeb3Token() });

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { did } = JSON.parse(req.body);

  if (did) {
    const fileName = `${did}.json`;
    const blob = new Blob([JSON.stringify({ did })], {
      type: "application/json",
    });
    const file = new File([blob], fileName);
    const cid = await web3Storage.put([file]);
    return res.status(200).json({ cid, fileName });
  }
  return res.status(400);
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default handler;
