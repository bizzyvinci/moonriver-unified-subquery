# Moonriver Unified Subquery

This repo indexes Substrate and Ethereum data on the Moonriver network using Subquery. It's still a work in progress as there are a number of issues to resolve but the purpose is to build a unified block explorer.

I'm stucked because of this error `ERROR failed to index block at height 59845 handleEvent() TypeError: Cannot read property 'block' of undefined` 😞 😢

However, the frontend explorer is live on [heroku](https://moonriver-explorer.herokuapp.com/) and the source code is [here](https://github.com/bizzyvinci/moonriver-explorer) (also in progress).

If you see this error, refresh the page

<img src='https://i.stack.imgur.com/ZDBwR.png' alt='nothing here yet error' width='500px' style='text-align: center;' />


## Terms
Terms used are a blend of subscan and moonscan with a little difference
* Block means block and the id is height rather than hash
* Extrinsic uses `block-index` as id rather than hash (which should not be confused with Transaction hash)
* Event `block-index`
* Account is address and could be a smart contract
* Transaction are ethereum transaction (just like on moonscan) and they have unique hash and linked to a particular extrinsic. Transaction is not MOVR transfered (as this is the term in subscan)
* Log are ethereum log which shows events that occured
* Transfer are MOVR transfered (this is subscan's transaction)
* Proposal and Referendum are governance
* Erc20Balance maps token and account with the amount held
* Erc721Balance maps token and account with the Token ID held
* Erc20Transfer and Erc721Transfer are transfers of Erc20Token and Erc721Token respectively
* Reward, Delegation, Delegator and Candidate are for staking events. This reflects the new terms used by moonbeam compared to the old Nomination, Nominator and Collator
* Day are for aggregating events. Would be useful for building analytics chart
