const SafeTX = artifacts.require("SafeTX");

contract("Safe Transactions", (accounts) => {
    let contract;
    let address;
    beforeEach(async () => {
        contract = await SafeTX.deployed();
        address = await contract.address;
        owner = accounts[0];
    });
    describe("Deployment", () => {
        it("Should deploy the contract", async () => {
            assert(address != null, "does not exist");
            assert(address != undefined, "does not exist");
            assert(address != 0x0, "does not exist");
        });
    });
    describe("Desposits", () => {
        it("Should receive ETH", async () => {
            await contract.deposit({ from: accounts[0], value: 1000 });
            const balance = await web3.eth.getBalance(contract.address);
            assert(parseInt(balance) === 1000);
        });
    });
    describe("Registration", () => {
        it("Should only allow owner to register an address", async () => {
            try {
                await contract.addKnown(accounts[1], { from: accounts[4] });
            } catch (e) {
                assert(
                    e.message.includes("You are not the owner of this wallet")
                );
            }
        });
    });
    describe("Withdrawal", () => {
        it("Should only process withdrawals from owner", async () => {
            try {
                await contract.withdraw(accounts[2], 100, {
                    from: accounts[3],
                });
            } catch (e) {
                assert(
                    e.message.includes("You are not the owner of this wallet")
                );
                return;
            }
            assert(false);
        });
        it("Should not process withdrawals exceeding balance", async () => {
            try {
                await contract.addKnown(accounts[2], { from: accounts[0] });
                await contract.withdraw(accounts[2], 1000000, {
                    from: accounts[0],
                });
            } catch (e) {
                assert(e.message.includes("insufficient funds"));
            }
        });
        it("Should process withdrawal", async () => {
            let account = accounts[4];
            let value = 50;
            await contract.addKnown(account, { from: owner });
            await contract.withdraw(account, value, { from: owner });
            console.log("Log:", `Transferred ${value} wei to ${account}`);
        });
    });
});
