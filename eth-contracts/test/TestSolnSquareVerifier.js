var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const proof = require('./../../zokrates/code/square/proof.json');
const truffleAssert = require('truffle-assertions');

contract('SolnSquareVerifier', accounts => {

    const owner = accounts[0];
    const accountOne = accounts[1];

    describe('Verified Minting', async () => {

        beforeEach(async () => {
            this.contract = await SolnSquareVerifier.new({ from: owner });
        });

        it('can add a new solution', async () => {
            let result = false;
            let tx = await this.contract.mintVerify(
                accountOne,
                1,
                proof.proof.a,
                proof.proof.b,
                proof.proof.c,
                proof.inputs,
                { from: owner }
            );

            truffleAssert.eventEmitted(tx, 'SolutionAdded', () => {
                result = true;
                return true;
            });

            assert.equal(result, true, "SolutionAdded event was not emitted");
        });

        it('can mint a new token', async () => {
            await this.contract.mint(accountOne, 1, { from: owner });
            let tokenBalance = await this.contract.balanceOf.call(accountOne);
            assert.equal(tokenBalance, 1, "Token balance does not match");
        });

        it('will not mint a new token with duplicate solution', async () => {
            let result = true;
            await this.contract.mintVerify(
                accountOne,
                1,
                proof.proof.a,
                proof.proof.b,
                proof.proof.c,
                proof.inputs,
                { from: owner }
            );
            try {
                await this.contract.mintVerify(
                    accountOne,
                    2,
                    proof.proof.a,
                    proof.proof.b,
                    proof.proof.c,
                    proof.inputs,
                    { from: owner }
                );
            } catch (e) {
                result = false;
            }
            assert.equal(result, false, "New token minted with duplicate solution");
        });

        it('will not mint a new token with bad verification', async () => {
            let result = true;
            try {
                await this.contract.mintVerify(
                    accountOne,
                    1,
                    proof.proof.a,
                    proof.proof.b,
                    proof.proof.c,
                    [6, 9],
                    { from: owner }
                );
            } catch (e) {
                result = false;
            }
            assert.equal(result, false, "New token minted with bad verification");
        });
    });
});