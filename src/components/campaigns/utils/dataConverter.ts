export const boostedBribesToPayoutListFormat = (list: any) => {
  const data = [];
  list.sort((a: any, b: any) => {
    return b.basicBoost2AmpInUSD - a.basicBoost2AmpInUSD;
  });
  for (let i = 0; i < list.length; i++) {
    console.log(list[i].address);
    data.push({
      autonomous: true,
      delegatedVotes: list[i].basicBoost2AmpInUSD.toFixed(2),
      payoutUSD: list[i].payoutUSD.toFixed(2),
      delegatedVotesRaw: 12,
      EOA: true,
      handle: "132443",
      id: list[i].address,
      votePercent: 1,
      votes: [
        {
          id: "Sdfsdf",
          support: true,
          votes: 1,
        },
      ],
    });
  }
  return data;
};

export const dataToTotalFormat = ({ data }: any) => {
  const list = data;
  const res = [];
  list.sort((a: any, b: any) => {
    return b.AMPinUSD - a.AMPinUSD;
  });
  for (let i = 0; i < list.length; i++) {
    console.log(list[i].address);
    res.push({
      autonomous: true,
      delegatedVotes: list[i].AMPinUSD.toFixed(2),
      payoutUSD: list[i].CRE8RinUSD.toFixed(2),
      delegatedVotesRaw: 12,
      EOA: true,
      handle: "132443",
      id: list[i].address,
      votePercent: 1,
      votes: [
        {
          id: "Sdfsdf",
          support: true,
          votes: 1,
        },
      ],
    });
  }
  return res;
};
