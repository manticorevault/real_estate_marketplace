var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const accountOne = accounts[1];
    const numOriginalTokens = 10;

    describe('have ownership properties', async () => {
        beforeEach(async () => {
            this.contract = await ERC721Mintable.new({ from: owner });
        });

        it('should fail when minting when address is not contract owner', async () => {
            let result = true;
            try {
                await this.contract.mint(accountOne, 1, { from: accountOne });
            } catch (e) {
                result = false;
            }
            assert.equal(result, false, "Non-owner able to mint coins");
        });

        it('should return contract owner', async () => {
            let contractOwner = await this.contract.getOwner.call();
            assert.equal(owner, contractOwner, "Owner does not match contract owner");
        });

        it('should transfer ownership', async () => {
            await this.contract.transferOwnership(accountOne, { from: owner });
            let newOwner = await this.contract.getOwner();
            assert.equal(accountOne, newOwner, "Ownership did not transfer");
        });

    });

    describe('have pause functionality', async () => {
        beforeEach(async () => {
            this.contract = await ERC721Mintable.new({ from: owner });
            await this.contract.setPaused(true, { from: owner });
        });

        it('should not mint when contract paused', async () => {
            let result = true;
            try {
                await this.contract.mint(accountOne, 1, { from: owner });
            } catch (e) {
                result = false;
            }
            assert.equal(result, false, "Minted coins while contract paused");
        });

        it('should mint when contract is unpaused', async () => {
            let result = true;
            await this.contract.setPaused(false, { from: owner });
            try {
                await this.contract.mint(accountOne, 1, { from: owner });
            } catch (e) {
                result = false;
            }
            assert.equal(result, true, "Could not mint coins when unpaused");
        });
    });

    describe('approval process', () => {
        beforeEach(async () => {
            this.contract = await ERC721Mintable.new({ from: owner });

            // Mint Coins
            await this.contract.mint(accountOne, 1, { from: owner });
        });

        it('should approve address from token owner', async () => {
            let result = true;
            try {
                await this.contract.approve(accounts[2], 1, { from: accountOne });
            } catch (e) {
                result = false;
            }
            assert.equal(result, true, "Error while approving address");
        });

        it('should approve address approved for all', async () => {
            await this.contract.setApprovalForAll(accounts[2], true);
            let result = true;
            try {
                await this.contract.approve(accounts[2], 1, { from: accountOne });
            } catch (e) {
                result = false;
            }
            assert.equal(result, true, "Error while approving address");
        });

        it('should set address approved for all', async () => {
            await this.contract.setApprovalForAll(accounts[2], true, { from: accountOne });
            let result = await this.contract.isApprovedForAll.call(accountOne, accounts[2]);
            assert.equal(result, true, "Address is not approved for all");
        });

        it('should unset address approved for all', async () => {
            await this.contract.setApprovalForAll(accounts[2], true, { from: accountOne });
            await this.contract.setApprovalForAll(accounts[2], false, { from: accountOne });
            let result = await this.contract.isApprovedForAll.call(accountOne, accounts[2]);
            assert.equal(result, false, "Address is still approved for all");
        });

        it('should not approve owner of token', async () => {
            let result = true;
            try {
                await this.contract.approve(accountOne, 1, { from: accountOne });
            } catch (e) {
                result = false;
            }
            assert.equal(result, false, "Owner of token should not be approved");
        });

        it('should not approve non-owner of token and not approved for all', async () => {
            let result = true;
            try {
                await this.contract.approve(accounts[2], 1, { from: accounts[3] });
            } catch (e) {
                result = false;
            }
            assert.equal(result, false, "Non-owner able to approve");
        });

        it('should return approved account', async () => {
            await this.contract.approve(accounts[2], 1, { from: accountOne });
            let getApproved = await this.contract.getApproved(1);
            assert.equal(accounts[2], getApproved, "Approved account does not match");
        });

    });

    describe('match erc721 spec', () => {
        beforeEach(async () => {
            this.contract = await ERC721Mintable.new({ from: owner });

            // Mint Coins
            for (var i = 1; i <= numOriginalTokens; i++) {
                await this.contract.mint(accountOne, i, { from: owner });
            }
        });

        it('should return total supply', async () => {
            let totalSupply = await this.contract.totalSupply.call({ from: owner });
            assert.equal(numOriginalTokens, totalSupply, "Total supply does not match");
        });

        it('should get token balance', async () => {
            let tokenBalance = await this.contract.balanceOf.call(accountOne);
            assert.equal(numOriginalTokens, tokenBalance, "Token balance does not match");
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async () => {
            let tokenURI = await this.contract.tokenURI.call(1);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", tokenURI, "Token URI does not match");
        });

        it('should transfer token from one owner to another', async () => {
            await this.contract.transferFrom(accountOne, accounts[2], 1, { from: accountOne });
            let tokenOwner = await this.contract.ownerOf.call(1);
            assert.equal(accounts[2], tokenOwner, 'Token owner does not match');
        });

        it('should transfer token from one owner to another from approved transferer', async () => {
            await this.contract.approve(accounts[2], 1, { from: accountOne });
            await this.contract.transferFrom(accountOne, accounts[3], 1, { from: accounts[2] });
            let tokenOwner = await this.contract.ownerOf.call(1);
            assert.equal(accounts[3], tokenOwner, 'Token owner does not match');
        });

        it('should transfer token from one owner to another from addressed approved for all', async () => {
            await this.contract.setApprovalForAll(accounts[2], true, { from: accountOne });
            await this.contract.transferFrom(accountOne, accounts[3], 1, { from: accounts[2] });
            let tokenOwner = await this.contract.ownerOf.call(1);
            assert.equal(accounts[3], tokenOwner, 'Token owner does not match');
        });

    });
});