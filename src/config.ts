const config = {
  rebrandly: {
    id: "e8427f17cf1041c39b96babd02efb4dd",
    fullName: "amplifi.gg", // this purely for cosmetic
  },
  airdrop: {
    excel: {
      id: "1u8IBLhr3Bk9MUkDquCEq2_q-IE-1KRiVYfo1la4nV_Y",
    },
  },
  campaign: {
    toast: "", //"Campaigns are still in testing phase and are subject to change. Please check back soon."
  },
  protocol: {
    tabs: [
      {
        title: "Campaigns",
        routePrefix: "/campaigns/",
      },
      {
        title: "Payouts",
        routePrefix: "/payouts/",
      },
      {
        title: 'Delegates',
        routePrefix: '/delegates/'
      },
      {
        title: 'Proposals',
        routePrefix: '/proposals/'
      }
    ]
  }
}

export default config;
