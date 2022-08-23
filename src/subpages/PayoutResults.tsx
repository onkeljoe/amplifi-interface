import React from "react";
import axios from "axios";
import PayoutList from "components/campaigns/PayoutList";
import { boostedBribesToPayoutListFormat } from "components/campaigns/utils/dataConverter";
import { AutoColumn } from "components/Column";
import { LoadingRows } from "components/Loader";
import { useEffect, useState } from "react";

const lastPayoutUri =
  "https://raw.githubusercontent.com/CRE8RDAO/booosted-bribes/master/payouts/out/bribe-payouts-44457923.json";

function PayoutMethodology() {
  const [lastPayout, setLastPayout] = useState<any>();

  useEffect(() => {
    axios.get(lastPayoutUri).then((res) => {
      if (res.status === 200) {
        setLastPayout(res.data);
      }
    });
  }, []);

  return (
    <>
      {!lastPayout ? (
        <>
          <LoadingRows>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </LoadingRows>
        </>
      ) : (
        <>
          <div>
            <AutoColumn gap='6px'>
              <PayoutList
                title={"Payouts for round 18"}
                url={
                  "https://raw.githubusercontent.com/CRE8RDAO/booosted-bribes/master/payouts/out/bribe-payouts-45482115.json"
                }
                hideZero={false}
                dataConverter={boostedBribesToPayoutListFormat}
              />
            </AutoColumn>
          </div>
        </>
      )}
    </>
  );
}

export default PayoutMethodology;
