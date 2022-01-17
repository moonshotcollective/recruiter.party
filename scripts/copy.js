const { ethers } = require('ethers');
const { Core } = require('@self.id/core');
const { ABI } = require('./constants');

const getDidFromTokenURI = (tokenURI) => {
  const [ipfsWithColon, _, cid, didFilename] = tokenURI.split('/');
  const [did] = didFilename.split('.json');
  return {
    did,
    cid,
    tokenURI,
    filename: didFilename,
  };
};

const ceramicCoreFactory = () => {
  // connect to a known URL
  // const core = new Core({ ceramic: "http://localhost:7007" });
  // or use one of the preconfigured option
  return new Core({
    ceramic: 'https://ceramic-clay.3boxlabs.com',
    model: {
      definitions: {
        basicProfile:
          'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
        cryptoAccounts:
          'kjzl6cwe1jw149z4rvwzi56mjjukafta30kojzktd9dsrgqdgz4wlnceu59f95f',
        alsoKnownAs:
          'kjzl6cwe1jw146zfmqa10a5x1vry6au3t362p44uttz4l0k4hi88o41zplhmxnf',
        privateProfile:
          'kjzl6cwe1jw1464bnqysstn5eshsbk9yz2dnbtcfzhbpqwue2k32leeivlcjt5g',
        publicProfile:
          'kjzl6cwe1jw147i0qxo4lh6eogtql63pvbrso7sjs0r2fxp86eq811wm81i18z7',
      },
      schemas: {
        BasicProfile:
          'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
        CryptoAccounts:
          'ceramic://k3y52l7qbv1frypussjburqg4fykyyycfu0p9znc75lv2t5cg4xaslhagkd7h7mkg',
        AlsoKnownAs:
          'ceramic://k3y52l7qbv1fryojt8n8cw2k04p9wp67ly59iwqs65dejso566fij5wsdrb871yio',
        PrivateProfile:
          'ceramic://k3y52l7qbv1frybrrtk1m5oohw0x2b8x90kucjmf1pjkjh2kfiha2i2ybzn6pncow',
        PublicProfile:
          'ceramic://k3y52l7qbv1fry3nnnc4t0nwxi42xfvp7k3f7eve8nxhin70si735g1dmq2gr356o',
      },
      tiles: {},
    },
  });
};

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/'
  );
  const contract = new ethers.Contract(
    '0x9d70D8DF17e40Ec9b0870Fe8f2A41D77380137dB',
    ABI,
    provider
  );
  const lastTokenId = await contract.tokenId();
  console.log(lastTokenId.toString());
  const tokenIds = [...Array(parseInt(lastTokenId, 10)).keys()];
  const tokenURIs = await Promise.all(
    tokenIds.map(async (id) => contract.uri(id))
  );
  const developersDID = [
    ...new Set(tokenURIs.map((uri) => getDidFromTokenURI(uri).did)),
  ];
  const core = ceramicCoreFactory();
  const devProfiles = await Promise.all(
    developersDID.map(async (did) => ({
      did,
      basicProfile: await core.get('basicProfile', did),
      cryptoAccounts: await core.get('cryptoAccounts', did),
      webAccounts: await core.get('alsoKnownAs', did),
      publicProfile: await core.get('publicProfile', did),
      privateProfile: await core.get('privateProfile', did),
    }))
  );
  console.log(`devProfiles`, devProfiles);
  // TODO: Add this data to Mongo
}

if (require.main === module) {
  main();
}
